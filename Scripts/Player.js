function Player( gfx,sfx )
{
	function Bullet( pos,vel )
	{
		this.pos = new Vec2( pos.x,pos.y );
		this.vel = new Vec2( vel.x,vel.y );
		this.size = new Vec2( 8,8 );
		this.hitbox = new Rect( this.pos.x - 2.0,this.pos.y - 2.0,4.0,4.0 );
		
		const speed = 3.0;
		let dead = false;
		
		let range = 50;
		
		const myImg = gfx.LoadImage( "Images/Bullet.png" );
		// 
		this.Update=()=>
		{
			this.pos.Add( this.vel.GetMultiplied( speed ) );
			this.hitbox.MoveTo( this.pos );
			
			if( --range < 1 )
			{
				this.Kill();
			}
		}
		
		this.Draw=( gfx )=>
		{
			// gfx.DrawCircle( this.pos,4.0,"#A55" );
			gfx.DrawImage( myImg,this.pos
				.GetSubtracted( this.size.GetDivided( 2.0 ) ),
				this.size );
		}
		
		this.Kill=()=>
		{
			dead = true;
		}
		
		this.CheckCollisions=( rects )=>
		{
			for( let i in rects )
			{
				if( this.hitbox.Overlaps( rects[i].GetRect() ) )
				{
					this.Kill();
					rects[i].Hurt( 1 );
				}
			}
		}
		
		this.GetRect=()=>
		{
			return this.hitbox;
		}
		
		this.WillKill=()=>
		{
			return dead;
		}
	}
	
	function Filters()
	{
		let nFilters = 3;
		
		const filterImg = gfx.LoadImage( "Images/Filter.png" );
		const filterSize = new Vec2( 30,30 );
		// 
		this.Draw=( gfx )=>
		{
			for( let y = 0; y < nFilters; ++y )
			{
				gfx.DrawImage( filterImg,
					new Vec2( 8,gfx.ScreenHeight - y *
					filterSize.y * 1.2 - filterSize.y - 10 ),
					filterSize );
			}
		}
		
		this.UseFilter=()=>
		{
			--nFilters;
		}
		
		this.ObtainFilter=( amount )=>
		{
			nFilters += amount;
		}
		
		this.HasRemainingFilters=()=>
		{
			return( nFilters > 0 );
		}
	}
	// 
	GameObject.call( this );
	this.pos = new Vec2( gfx.ScreenWidth / 2,gfx.ScreenHeight / 2 );
	this.size = new Vec2( 20,20 );
	this.hitbox = new Rect( this.pos.x,this.pos.y,
		this.size.x,this.size.y );
	
	const speed = 1.4;
	let canMove = true;
	
	let pointerPos = new Vec2( 0,0 );
	const targetImg = gfx.LoadImage( "Images/Target.png" );
	
	let bullets = [];
	let bulletTimer = 0;
	let bulletTimeAdd = 1.0;
	const refireTime = 14;
	
	let hp = 10;
	let hurt = false;
	let hurtTimer = 0;
	const unhurtTime = 15;
	let moveAwayFromDir = new Vec2( 0,0 );
	
	let canCollect = false;
	const collectImg = gfx.LoadImage( "Images/CollectButton.png" );
	
	const runRight =
	[
		gfx.LoadImage( "Images/Player3-0.png" ),
		gfx.LoadImage( "Images/Player3-1.png" ),
		gfx.LoadImage( "Images/Player3-2.png" ),
		gfx.LoadImage( "Images/Player3-3.png" ),
		gfx.LoadImage( "Images/Player3-4.png" ),
		gfx.LoadImage( "Images/Player3-5.png" )
	];
	const runLeft =
	[
		gfx.LoadImage( "Images/Player2-0.png" ),
		gfx.LoadImage( "Images/Player2-1.png" ),
		gfx.LoadImage( "Images/Player2-2.png" ),
		gfx.LoadImage( "Images/Player2-3.png" ),
		gfx.LoadImage( "Images/Player2-4.png" ),
		gfx.LoadImage( "Images/Player2-5.png" )
	];
	let curStep = 0.0;
	const stepAdvanceRate = 0.1;
	let lookingDir = 1; // 1 for right, -1 for left.
	
	const bulletSounds =
	[
		// sfx.LoadSound( "Audio/Plop1.wav" ),
		sfx.LoadSound( "Audio/Plop2.wav" ),
		sfx.LoadSound( "Audio/Plop3.wav" )
	];
	const shuffles =
	[
		sfx.LoadSound( "Audio/Shuffle1.wav" ),
		sfx.LoadSound( "Audio/Shuffle2.wav" ),
		sfx.LoadSound( "Audio/Shuffle3.wav" ),
		sfx.LoadSound( "Audio/Shuffle4.wav" )
	];
	let playingShuffleSound = false;
	
	const leftSteps =
	[
		sfx.LoadSound( "Audio/Step1.wav" ),
		sfx.LoadSound( "Audio/Step3.wav" ),
		sfx.LoadSound( "Audio/Step5.wav" )
	];
	const rightSteps =
	[
		sfx.LoadSound( "Audio/Step2.wav" ),
		sfx.LoadSound( "Audio/Step4.wav" ),
		sfx.LoadSound( "Audio/Step6.wav" )
	];
	let curAudStep = leftSteps[0];
	let lastStep = 1;
	
	const f = new Filters();
	
	let canLoot = false;
	let lootGuy;
	let lootProgress = 0;
	const lootTime = 140;
	
	const IS_GOD = false; // Important that this is false.
	// 
	this.Start=()=>
	{
		
	}
	
	this.Update=( kbd,ms,map )=>
	{
		canLoot = false;
		// TODO: Make totalMove stuff at least a little cleaner.
		const totalMove = new Vec2( 0,0 );
		const move = new Vec2( 0,0 );
		if( kbd.KeyDown( 'W' ) || kbd.KeyDown( 38 ) )
		{
			move.y -= 1;
			totalMove.y -= 1;
		}
		if( kbd.KeyDown( 'S' ) || kbd.KeyDown( 40 ) )
		{
			move.y += 1;
			totalMove.y += 1;
		}
		if( kbd.KeyDown( 'A' ) || kbd.KeyDown( 37 ) )
		{
			move.x -= 1;
			totalMove.x -= 1;
		}
		if( kbd.KeyDown( 'D' ) || kbd.KeyDown( 39 ) )
		{
			move.x += 1;
			totalMove.x += 1;
		}
		
		if( move.x > 0.0 || move.y < 0.0 )
		{
			curStep += stepAdvanceRate;
			if( curStep > runRight.length - 1 )
			{
				curStep = 0.0;
			}
			lookingDir = 1;
		}
		if( move.x < 0.0 || move.y > 0.0 )
		{
			curStep += stepAdvanceRate;
			if( curStep > runRight.length - 1 )
			{
				curStep = 0.0;
			}
			lookingDir = -1;
		}
		
		if( ( move.x != 0.0 || move.y != 0.0 ) && !sfx.IsPlaying( curAudStep ) )
		{
			if( lastStep < 0 )
			{
				curAudStep = leftSteps[Random.RangeI( 0,leftSteps.length - 1 )];
			}
			else
			{
				curAudStep = rightSteps[Random.RangeI( 0,leftSteps.length - 1 )];
			}
			sfx.PlaySound( curAudStep,0.7 );
		}
		
		// if( IS_GOD )
		// {
		// 	this.hitbox.MoveTo( new Vec2( 9999,9999 ) );
		// }
		
		move.Normalize();
		totalMove.Normalize();
		if( canMove || IS_GOD )
		{
			move.Multiply( speed );
		}
		else
		{
			move.Divide( speed * speed * speed );
		}
		
		if( IS_GOD && !kbd.KeyDown( 16 ) )
		{
			move.Multiply( 7.0 );
		}
		this.pos.Add( move.GetMultiplied( speed ) );
		this.hitbox.MoveTo( this.pos.GetSubtracted( this.size
			.GetDivided( 2.0 ) ) );
		
		const foliages = map.GetObstacles();
		if( !IS_GOD )
		{
			for( let i in foliages )
			{
				// UCK!! Make this cleaner pls.
				if( this.hitbox.Overlaps( foliages[i].GetRect() ) )
				{
					// this.pos.Subtract( move.GetMultiplied( speed ) );
					this.pos.x -= move.x * speed;
					this.hitbox.MoveTo( this.pos.GetSubtracted( this.size
						.GetDivided( 2.0 ) ) );
					// totalMove.x -= move.x * speed;
				}
				if( this.hitbox.Overlaps( foliages[i].GetRect() ) )
				{
					this.pos.x += move.x * speed;
					this.pos.y -= move.y * speed;
					this.hitbox.MoveTo( this.pos.GetSubtracted( this.size
						.GetDivided( 2.0 ) ) );
					// totalMove.x += move.x * speed;
					// totalMove.y -= move.y * speed;
				}
			}
		}
		this.hitbox.MoveTo( this.pos.GetSubtracted( this.size
			.GetDivided( 2.0 ) ) );
		// if( IS_GOD )
		// {
		// 	this.hitbox.MoveTo( new Vec2( 9999,9999 ) );
		// }
		
		pointerPos = ms.GetPos();
		
		bulletTimer += bulletTimeAdd;
		if( ( bulletTimer > refireTime || IS_GOD ) &&
			ms.IsDown() && canMove )
		{
			bulletTimer = 0;
			bullets.push( new Bullet( this.pos,pointerPos
				.GetSubtracted( this.pos ).GetNormalized() ) );
			sfx.PlaySound( bulletSounds[Random.RangeI( 0,bulletSounds.length - 1 )],
				0.7 );
			
			// Handle lookingDir.  Or, maybe not. XD
			// if( ms.GetPos().x < this.pos.x )
			// {
			// 	lookingDir = -1;
			// }
			// else
			// {
			// 	lookingDir = 1;
			// }
		}
		
		for( let i in bullets )
		{
			bullets[i].Update();
			if( !IS_GOD )
			{
				bullets[i].CheckCollisions( foliages );
			}
			
			if( bullets[i].WillKill() )
			{
				bullets.splice( i,1 );
				--i;
			}
		}
		
		// Handling getting loot.
		const lootItems = map.GetLootables();
		for( let i in lootItems )
		{
			if( !lootItems[i].IsLooted() &&
				this.hitbox.Overlaps( lootItems[i].GetRect() ) )
			{
				canLoot = true;
				lootGuy = lootItems[i];
			}
		}
		
		// Level transitions!
		if( this.pos.y < 0 )
		{
			map.ChangeLevel( new Vec2( 0,-1 ) );
			this.pos.y = gfx.ScreenHeight - this.size.y * 2;
			bullets = [];
		}
		else if( this.pos.y + this.size.y > gfx.ScreenHeight )
		{
			map.ChangeLevel( new Vec2( 0,1 ) );
			this.pos.y = 0 + this.size.y * 2;
			bullets = [];
		}
		else if( this.pos.x < 0 )
		{
			map.ChangeLevel( new Vec2( -1,0 ) );
			this.pos.x = gfx.ScreenWidth - this.size.x * 2;
			bullets = [];
		}
		else if( this.pos.x + this.size.x > gfx.ScreenWidth )
		{
			map.ChangeLevel( new Vec2( 1,0 ) );
			this.pos.x = 0 + this.size.x * 2;
			bullets = [];
		}
		
		if( hurt )
		{
			const diff = this.pos.GetSubtracted( moveAwayFromDir );
			diff.Normalize();
			this.pos.Add( diff.GetMultiplied( speed * 1.7 ) );
			this.pos.Subtract( totalMove );
		
			if( ++hurtTimer > unhurtTime )
			{
				hurtTimer = 0;
				hurt = false;
			}
		}
		
		canCollect = false;
		if( !hurt )
		{
			const zombos = map.GetZombos();
			for( let i in zombos )
			{
				if( !IS_GOD )
				{
					if( zombos[i].IsActivated() &&
						zombos[i].IsAlive() )
					{
						if( this.hitbox.Overlaps( zombos[i].GetRect() ) )
						{
							--hp;
							hurt = true;
							f.UseFilter();
							moveAwayFromDir = zombos[i].GetPos();
						}
					}
				}
				
				if( !zombos[i].IsLooted() && !zombos[i].IsAlive() &&
					this.hitbox.Overlaps( zombos[i].GetRect() ) )
				{
					canLoot = true;
					lootGuy = zombos[i];
				}
				else
				{
					canCollect = true;
				}
			}
		}
		
		if( canLoot && kbd.KeyDown( 'E' ) )
		{
			canMove = false;
			if( ++lootProgress > lootTime )
			{
				lootProgress = 0;
				f.ObtainFilter( lootGuy.Loot() );
				playingShuffleSound = false;
				
				for( let i in shuffles )
				{
					sfx.StopSound( shuffles[i] );
				}
			}
			if( !playingShuffleSound )
			{
				playingShuffleSound = true;
				sfx.PlaySound( shuffles[Random.RangeI( 0,shuffles.length - 1 )],
					0.7 );
			}
		}
		else
		{
			for( let i in shuffles )
			{
				sfx.StopSound( shuffles[i] );
			}
			playingShuffleSound = false;
			lootProgress = 0;
			canMove = true;
		}
	}
	
	this.Draw=( gfx )=>
	{
		// gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2.0 ) ),
		// 	this.size,"#777" );
		if( lookingDir > 0 )
		{
			gfx.DrawImage( runRight[Math.floor( curStep )],
				this.pos.GetSubtracted( this.size.GetDivided( 2.0 ) ),
				this.size );
		}
		else
		{
			gfx.DrawImage( runLeft[Math.floor( curStep )],
				this.pos.GetSubtracted( this.size.GetDivided( 2.0 ) ),
				this.size );
		}
		
		if( hurt )
		{
			gfx.SetAlpha( 0.5 );
			gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2.0 ) ),
				this.size,"#F00" );
			gfx.SetAlpha( 1.0 );
		}
		
		if( canLoot )
		{
			gfx.DrawImage( collectImg,this.pos
				.GetSubtracted( new Vec2( this.size.x / 2,35 ) ),
				new Vec2( 20,20 ) );
			
			gfx.DrawRect( this.pos
				.GetAdded( new Vec2( -this.size.x / 2,this.size.y / 1.6 ) ),
				new Vec2( ( lootProgress / lootTime )
				* this.size.x,5 ),"#FFF" );
		}
		
		// gfx.DrawCircle( pointerPos,2.0,"#FA0" );
		gfx.DrawImage( targetImg,pointerPos
			.GetSubtracted( new Vec2( 6,6 ) ),new Vec2( 12,12 ) );
		
		for( let i in bullets )
		{
			bullets[i].Draw( gfx );
		}
	}
	
	this.DrawMenu=( gfx )=>
	{
		f.Draw( gfx );
	}
	
	this.GetPos=()=>
	{
		return this.pos;
	}
	
	this.GetBullets=()=>
	{
		return bullets;
	}
}