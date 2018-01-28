function Infected( gfx,sfx )
{
	GameObject.call( this );
	this.size = new Vec2( 30,30 );
	
	const range = 250.0;
	const speed = 0.8;
	
	let hp = Random.RangeF( 5,12 );
	let dead = false;
	let skipFrame = false;
	let hurtTimer = 0;
	const unhurtTime = 7;
	
	const nSlime = Random.RangeI( 1,2 );
	let images = [];
	let hurtImages = [];
	let deadImage;
	let dir = new Vec2( 0,0 );
	
	let hasLoot = true;
	
	let activationTimer = Random.RangeI( 120,180 );
	
	const splooshes =
	[
		sfx.LoadSound( "Audio/Sploosh1.wav" ),
		sfx.LoadSound( "Audio/Sploosh3.wav" ),
		sfx.LoadSound( "Audio/Sploosh4.wav" ),
		sfx.LoadSound( "Audio/Sploosh5.wav" ),
		sfx.LoadSound( "Audio/Sploosh6.wav" ),
		sfx.LoadSound( "Audio/Sploosh7.wav" )
	];
	const deadSound = sfx.LoadSound( "Audio/Sploosh2.wav" );
	// 
	this.Start=()=>
	{
		this.pos.x = Random.RangeF( this.size.x,gfx.ScreenWidth - this.size.x );
		this.pos.y = Random.RangeF( this.size.y,gfx.ScreenHeight - this.size.y );
		
		this.hitbox = new Rect( this.pos.x,this.pos.y,
			this.size.x,this.size.y );
		
		for( let i = 4; i < 8; ++i )
		{
			images.push( gfx.LoadImage( "Images/Slime" + 
				nSlime + "-" + i + ".png" ) );
		}
		for( let i = 8; i < 12; ++i )
		{
			hurtImages.push( gfx.LoadImage( "Images/Slime" + 
				nSlime + "-" + i + ".png" ) );
		}
		
		deadImage = gfx.LoadImage( "Images/Slime" + nSlime + "-12.png" );
	}
	
	this.Update=( target )=>
	{
		if( !dead && --activationTimer < 1 )
		{
			if( skipFrame )
			{
				if( ++hurtTimer > unhurtTime )
				{
					hurtTimer = 0;
					skipFrame = false;
				}
			}
			else if( this.pos.GetSubtracted( target )
				.GetLengthSq() < range * range )
			{
				dir = this.pos
					.GetSubtracted( target )
					.GetNormalized()
					.GetMultiplied( -speed );
				this.pos.Add( dir );
				
				this.hitbox.MoveTo( this.pos.GetSubtracted( this.size
					.GetDivided( 2.0 ) ) );
			}
			else
			{
				if( Random.Chance( 2.5 ) )
				{
					dir = new Vec2( Random.RangeF( -1,1 ),
						Random.RangeF( -1,1 ) );
					
					if( Random.Chance( 15 ) )
					{
						this.pos.Add( dir.GetNormalized()
							.GetMultiplied( speed * Random.RangeF( 9.0,11.0 ) ) );
					}
				}
			}
		}
	}
	
	this.Draw=( gfx )=>
	{
		if( hasLoot )
		{
			if( !dead && activationTimer < 1 )
			{
				// gfx.DrawRect( this.pos.GetSubtracted( this.size
				// 	.GetDivided( 2.0 ) ),this.size,"#4C3" );
				let imgToDraw = 0;
				if( dir.y < 0 && dir.x > 0 )
				{
					imgToDraw = 0;
				}
				if( dir.y > 0 && dir.x > 0 )
				{
					imgToDraw = 1;
				}
				if( dir.y > 0 && dir.x < 0 )
				{
					imgToDraw = 2;
				}
				if( dir.y < 0 && dir.x < 0 )
				{
					imgToDraw = 3;
				}
				if( !skipFrame )
				{
					gfx.DrawImage( images[imgToDraw],
						this.pos.GetSubtracted( this.size.GetDivided( 2.0 ) ),
						this.size );
				}
				else
				{
					gfx.DrawImage( hurtImages[imgToDraw],
						this.pos.GetSubtracted( this.size.GetDivided( 2.0 ) ),
						this.size );
				}
			}
			else
			{
				gfx.DrawImage( deadImage,
					this.pos.GetSubtracted( this.size.GetDivided( 2.0 ) ),
					this.size );
			}
		}
	}
	
	this.MoveAwayFrom=( badSpot )=>
	{
		this.pos.Add( ( this.pos
				.GetSubtracted( badSpot )
				.GetNormalized()
				.GetMultiplied( 0.9 ) ) );
		
		this.hitbox.MoveTo( this.pos );
	}
	
	this.Hurt=( amount )=>
	{
		if( activationTimer < 1 )
		{
			const soundLevel = 0.5;
			sfx.PlaySound( splooshes[Random.RangeI( 0,splooshes.length - 1 )],
				soundLevel );
			skipFrame = true;
			hp -= amount;
			if( hp < 0.0 )
			{
				dead = true;
				sfx.PlaySound( deadSound,soundLevel );
			}
		}
	}
	
	this.Loot=()=>
	{
		if( hasLoot )
		{
			hasLoot = false;
			if( Random.Chance( 20 ) )
			{
				return 1;
			}
			else
			{
				return 0;
			}
		}
	}
	
	this.IsLooted=()=>
	{
		return !hasLoot;
	}
	
	this.GetPos=()=>
	{
		return this.pos;
	}
	
	this.GetRect=()=>
	{
		return this.hitbox;
	}
	
	this.IsAlive=()=>
	{
		return !dead;
	}
	
	this.IsActivated=()=>
	{
		return( activationTimer < 1 );
	}
}