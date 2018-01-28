function Map( gfx,announcer,sfx )
{
	function Level( pos,isLastLevel,posVec )
	{
		function Obstacle()
		{
			this.image;
			this.size;
			this.pos;
			this.hitbox;
			let hp = 5;
			// 
			this.Generate=()=>
			{
				const images =
				[
					{ i: gfx.LoadImage( "Images/Foliage1.png" ),w: 50,h: 50,
						hb: new Rect( 4,20,18,6 ) },
					// { i: gfx.LoadImage( "Images/Foliage2.png" ),w: 100,h: 50,
					// 	hb: new Rect( 3,3,46,21 ) },
					{ i: gfx.LoadImage( "Images/Foliage3.png" ),w: 50,h: 50,
						hb: new Rect( 4,20,18,6 ) },
					{ i: gfx.LoadImage( "Images/Foliage4.png" ),w: 50,h: 50,
						hb: new Rect( 0,15,25,10 ) }
				];
				
				this.image = images[Random.RangeI( 0,images.length - 1 )];
				this.size = new Vec2( this.image.w,this.image.h );
				
				this.pos = new Vec2( Random.Range( 0,gfx.ScreenWidth - this.size.x ),
					Random.Range( 0,gfx.ScreenHeight - this.size.y ) );
				
				this.hitbox = this.image.hb;
				this.hitbox.MoveTo( new Vec2( this.pos.x + this.hitbox.x * 2,
					this.pos.y + this.hitbox.y * 2 ) );
				this.hitbox.width = this.image.hb.width * 2;
				this.hitbox.height = this.image.hb.height * 2;
			}
			
			this.Draw=( gfx )=>
			{
				gfx.DrawImage( this.image.i,this.pos,this.size );
			}
			
			this.Hurt=( amount )=>
			{
				hp -= amount;
			}
			
			this.GetRect=()=>
			{
				return this.hitbox;
			}
		}
		
		function Lootable()
		{
			this.image;
			this.pos;
			this.size;
			this.hitbox;
			let looted = false;
			// 
			this.Generate=()=>
			{
				const images =
				[
					{ i: gfx.LoadImage( "Images/Lootable1-0.png" ),
						i2: gfx.LoadImage( "Images/Lootable1-1.png" ),
						w: 20,h: 20,
						hb: new Rect( 0,0,10,10 ) }
				];
				
				this.image = images[Random.RangeI( 0,images.length - 1 )];
				this.size = new Vec2( this.image.w,this.image.h );
				
				this.pos = new Vec2( Random.Range( 0,gfx.ScreenWidth - this.size.x ),
					Random.Range( 0,gfx.ScreenHeight - this.size.y ) );
				
				this.hitbox = this.image.hb;
				this.hitbox.MoveTo( new Vec2( this.pos.x + this.hitbox.x * 2,
					this.pos.y + this.hitbox.y * 2 ) );
				this.hitbox.width = this.image.hb.width * 2;
				this.hitbox.height = this.image.hb.height * 2;
			}
			
			this.Draw=( gfx )=>
			{
				if( !looted )
				{
					gfx.DrawImage( this.image.i,this.pos,this.size );
				}
				else // If looted.
				{
					gfx.DrawImage( this.image.i2,this.pos,this.size );
				}
			}
			
			this.Loot=()=>
			{
				looted = true;
				return Random.RangeI( 0,3 );
			}
			
			this.GetRect=()=>
			{
				return this.hitbox;
			}
			
			this.IsLooted=()=>
			{
				return looted;
			}
		}
		
		function RadioStation()
		{
			const img = gfx.LoadImage( "Images/Station.png" );
			const size = new Vec2( 80,80 );
			const pos = new Vec2( gfx.ScreenWidth / 2 - size.x / 2,
				gfx.ScreenHeight / 2 - size.y / 2 );
			const hitbox = new Rect( pos.x,pos.y,size.x,size.y );
			// 
			this.Draw=( gfx )=>
			{
				gfx.DrawImage( img,pos,size );
			}
			
			this.GetRect=()=>
			{
				return hitbox;
			}
		}
		// 
		const GenerateGroundColor=()=>
		{
			const hexChars = [ '4','5','6' ];
			let color = "#77";
			for( let i = 0; i < 4; ++i )
			{
				color += hexChars[Random.RangeI( 0,hexChars.length - 1 )];
			}
			return color;
		}
		// 
		this.pos = pos;
		const containsOperator = Random.RangeI( 0,1 ); // Converts to bool. :)
		let nInfected = Random.RangeI( 2,7 );
		let obstacles = [];
		let lootables = [];
		
		let started = false;
		
		let groundColor = GenerateGroundColor();
		
		let lastLevel = isLastLevel;
		let hasStation = false;
		let station;
		// 
		this.Start=()=>
		{
			if( !started )
			{
				for( let i = 0; i < Random.RangeI( 7,28 ); ++i )
				{
					obstacles.push( new Obstacle() );
					if( Random.Chance( 15 ) )
					{
						lootables.push( new Lootable() );
					}
				}
				for( let i in obstacles )
				{
					obstacles[i].Generate();
				}
				for( let i in lootables )
				{
					lootables[i].Generate();
				}
				
				if( lastLevel )
				{
					station = new RadioStation();
					hasStation = true;
					nInfected += Random.RangeI( 7,15 );
					this.Position = posVec;
				}
				started = true;
			}
		}
		
		this.Draw=( gfx )=>
		{
			for( let i in obstacles )
			{
				obstacles[i].Draw( gfx );
			}
			if( hasStation )
			{
				station.Draw( gfx );
			}
		}
		
		this.DrawGround=( gfx )=>
		{
			gfx.DrawRect( new Vec2( 0,0 ),
				new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),
				groundColor );
			
			for( let i in lootables )
			{
				lootables[i].Draw( gfx );
			}
		}
		
		this.KillInfected=()=>
		{
			--nInfected;
		}
		
		this.HasOperator=()=>
		{
			return containsOperator;
		}
		
		this.HasStation=()=>
		{
			return lastLevel;
		}
		
		this.GetStation=()=>
		{
			return station;
		}
		
		this.GetNZombos=()=>
		{
			return nInfected;
		}
		
		this.GetHitboxes=()=>
		{
			let hitboxes = [];
			for( let i in obstacles )
			{
				hitboxes.push( obstacles[i] );
			}
			return hitboxes;
		}
		
		this.GetLootSpots=()=>
		{
			return lootables;
		}
		
		this.IsFinalLevel=()=>
		{
			return lastLevel;
		}
	}
	// 
	let levels = [];
	let curLevel;
	
	let zombos = [];
	
	const maxSize = new Vec2( 20,20 );
	
	let playerPos;
	let targetLevelPos;
	
	let isFirstLevel = true;
	
	let wonGame = false;
	
	let beginLevel = new Level( new Vec2( -1,-1 ),true,new Vec2( -1,-1 ) );
	// 
	this.Start=()=>
	{
		let lastLevel = false;
		for( let y = 0; y < maxSize.y; ++y )
		{
			for( let x = 0; x < maxSize.x; ++x )
			{
				// if( !lastLevel && Random.Chance( 5 ) )
				// {
				// 	lastLevel = true;
				// 	levels.push( new Level( new Vec2( x,y ),true ) );
				// 	console.log( x + " " + y );
				// }
				// else
				{
					levels.push( new Level( new Vec2( x,y ),false,new Vec2( x,y ) ) );
				}
			}
		}
		const lastLevelPos = new Vec2( 0,0 );
		if( !lastLevel )
		{
			lastLevel = true;
			const xPos = Random.RangeI( 1,maxSize.x - 1 );
			const yPos = Random.RangeI( 1,maxSize.y - 1 );
			lastLevelPos.x = xPos;
			lastLevelPos.y = yPos;
			levels[yPos * maxSize.x + xPos] =
				( new Level( new Vec2( xPos,yPos ),
				true,new Vec2( xPos,yPos ) ) );
			targetLevelPos = new Vec2( xPos,yPos );
			// console.log( xPos + " " + yPos );
		}
		
		do
		{
			playerPos = new Vec2( Random.RangeI( 3,maxSize.x - 3 ),
				Random.RangeI( 3,maxSize.y - 3 ) );
		}
		while( playerPos.Equals( lastLevelPos ) );
		this.ChangeLevel( new Vec2( 0,0 ) );
		
		// 
		
		// startLevel = levels[playerPos.y * maxSize.x + playerPos.x];
		beginLevel.Start();
		zombos = [];
		for( let i = 0; i < beginLevel.GetNZombos(); ++i )
		{
			zombos.push( new Infected( gfx,sfx ) );
			zombos[i].Start();
		}
	}
	
	this.Update=( target )=>
	{
		for( let i in zombos )
		{
			zombos[i].Update( target );
			
			if( i > 0 && zombos[i].IsAlive() &&
				zombos[i].GetRect()
				.Overlaps( zombos[i - 1].GetRect() ) )
			{
				zombos[i].MoveAwayFrom( zombos[i - 1].GetPos() );
			}
			
			const hbs = curLevel.GetHitboxes();
			for( let j in hbs )
			{
				if( zombos[i].GetRect().Overlaps( hbs[j].GetRect() ) )
				{
					zombos[i].MoveAwayFrom( hbs[j].GetRect() );
				}
			}
		}
		// console.log( playerPos );
		
		let numAliveZombies = 0;
		for( let i in zombos )
		{
			if( zombos[i].IsAlive() )
			{
				++numAliveZombies;
			}
		}
		if( curLevel.IsFinalLevel() && numAliveZombies < 1 )
		{
			wonGame = true;
		}
	}
	
	this.Draw=( gfx )=>
	{
		curLevel.DrawGround( gfx );
		for( let i in zombos )
		{
			zombos[i].Draw( gfx );
		}
	}
	
	this.DrawTop=( gfx )=>
	{
		curLevel.Draw( gfx );
	}
	
	this.DrawMenu=( gfx )=>
	{
		beginLevel.DrawGround( gfx );
		for( let i in zombos )
		{
			zombos[i].Update( new Vec2( 9999,9999 ) );
			zombos[i].Draw( gfx );
		}
		beginLevel.Draw( gfx );
	}
	
	this.CheckCollisions=( bullets )=>
	{
		for( let i in zombos )
		{
			for( let j in bullets )
			{
				if( zombos[i].IsAlive() &&
					zombos[i].IsActivated() && // Important!!!
					zombos[i].GetRect()
					.Overlaps( bullets[j].GetRect() ) )
				{
					bullets[j].Kill();
					zombos[i].Hurt( 1.0 );
					
					if( !zombos[i].IsAlive() )
					{
						// zombos.splice( i,1 );
						curLevel.KillInfected();
						break;
						// --i;
					}
					// break;
				}
			}
		}
	}
	
	this.ChangeLevel=( exitDir )=>
	{
		// Make sure exitDir is a Vec2 with one 1 and one 0.
		playerPos.Add( exitDir );
		curLevel = levels[playerPos.y * maxSize.x + playerPos.x];
		curLevel.Start();
		zombos = [];
		for( let i = 0; i < curLevel.GetNZombos(); ++i )
		{
			zombos.push( new Infected( gfx,sfx ) );
			zombos[i].Start();
		}
		// console.log( playerPos );
		if( isFirstLevel )
		{
			announcer.SendIntroMessage();
			isFirstLevel = false;
		}
		else if( Random.Chance( 70 ) ||
			playerPos.Equals( targetLevelPos ) )
		{
			announcer.SendPosMessage( playerPos,targetLevelPos );
		}
	}
	
	this.FlushZombos=()=>
	{
		zombos = [];
	}
	
	this.GetObstacles=()=>
	{
		return curLevel.GetHitboxes();
	}
	
	this.GetLootables=()=>
	{
		return curLevel.GetLootSpots();
	}
	
	this.GetZombos=()=>
	{
		return zombos;
	}
	
	this.HasWonGame=()=>
	{
		return wonGame;
	}
}