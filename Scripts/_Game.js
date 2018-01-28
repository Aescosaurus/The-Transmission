"use strict";

function Button( pos,size,color,fadeColor,text,font,textColor )
{
	let offset = new Vec2( 0,0 );
	const hitbox = new Rect( pos.x,pos.y,size.x,size.y );
	let drawColor = color;
	const speed = 5;
	let clicked = false;
	let canClick = false;
	// 
	this.Update=( mouse )=>
	{
		hitbox.MoveTo( pos );
		
		if( ( new Rect( mouse.GetPos().x,mouse.GetPos().y,1,1 ) )
			.Overlaps( hitbox ) )
		{
			drawColor = fadeColor;
			if( offset.x < 20 )
			{
				offset.x += speed;
			}
			if( mouse.IsDown() && canClick )
			{
				clicked = true;
			}
			else
			{
				clicked = false;
			}
			if( !mouse.IsDown() )
			{
				canClick = true;
			}
			else
			{
				canClick = false;
			}
		}
		else
		{
			drawColor = color;
			if( offset.x > 0 )
			{
				offset.x -= speed;
			}
		}
	}
	
	this.Draw=( gfx )=>
	{
		gfx.DrawRect( pos.GetAdded( offset ),size,drawColor );
		gfx.DrawText( pos.GetAdded( new Vec2( 50,0 ) ).GetAdded( offset )
			.GetAdded( new Vec2( 0,size.y - size.y / 6 ) ),
			font,textColor,text );
	}
	
	this.HasClicked=()=>
	{
		return clicked;
	}
}

(function()
{
const gfx = new Graphics();
const kbd = new Keyboard();
const ms = new Mouse();
const sfx = new AAudio();

// const ex = new Example();
let p = new Player( gfx,sfx );
let a = new Announcer( gfx );
let m = new Map( gfx,a,sfx );

let start = new Button( new Vec2( -30,150 ),new Vec2( 200,35 ),"#A55","#E11",
	"Start","30PX Arial","#FFF" );
let finished = false;
let started = false;

let fadeoutOpacity = 1.0;
const opacityGainRate = 0.0008;

const startScreen = gfx.LoadImage( "Images/IhaveStarted.png" );
const winScreen = gfx.LoadImage( "Images/IHaveWon.png" );
const bgMenu = gfx.LoadImage( "Images/Menu.png" );

const bgAuds =
[
	sfx.LoadSound( "Audio/Wind1.wav" ),
	sfx.LoadSound( "Audio/Wind2.wav" ),
];

window.onload = function()
{
	Start();
	const fps = 60;
	setInterval( function()
	{
		Update();
		Draw();
	},1000 / fps );
}

function Start()
{
	kbd.Start();
	ms.Start( gfx.GetCanvas() );
	gfx.Start();
	// Initialize below!
	// ex.Start( gfx );
	p.Start();
	m.Start();
	sfx.LoopSound( bgAuds[Random.Range( 0,bgAuds.length - 1 )] );
}

function Update()
{
	// Update below.
	// ex.Update( ms );
	if( started && !finished )
	{
		p.Update( kbd,ms,m );
		m.Update( p.GetPos() );
		m.CheckCollisions( p.GetBullets() );
		if( m.HasWonGame() )
		{
			finished = true;
		}
	}
	else if( finished )
	{
		
	}
	else
	{
		if( fadeoutOpacity < 0.4 )
		{
			start.Update( ms );
			if( start.HasClicked() )
			{
				started = true;
				sfx.StopSound( bgAuds[Random.Range( 0,bgAuds.length - 1 )] );
				sfx.LoopSound( bgAuds[Random.Range( 0,bgAuds.length - 1 )] );
				m.FlushZombos();
			}
		}
	}
}

function Draw()
{
	gfx.DrawRect( new Vec2( 0,0 ),new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),"#000" );
	// Draw below.
	// ex.Draw( gfx );
	if( started )
	{
		m.Draw( gfx );
		p.Draw( gfx );
		m.DrawTop( gfx );
		p.DrawMenu( gfx );
		a.Draw( gfx ); // Needs to be on top.
		if( finished )
		{
			gfx.SetAlpha( fadeoutOpacity );
			
			fadeoutOpacity += opacityGainRate;
			gfx.DrawRect( new Vec2( 0,0 ),
				new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),
				"black" );
			gfx.DrawImage( winScreen,new Vec2( 0,0 ) );
			
			gfx.SetAlpha( 1.0 );
			
			if( fadeoutOpacity > 1.0 )
			{
				p = new Player( gfx,sfx );
				a = new Announcer( gfx );
				m = new Map( gfx,a,sfx );
				p.Start();
				m.Start();
				
				start = new Button( new Vec2( -30,150 ),new Vec2( 200,35 ),"#A55","#E11",
					"Start","30PX Arial","#FFF" );
				finished = false;
				started = false;
				
				let fadeoutOpacity = 0.0;
			}
		}
	}
	else
	{
		// gfx.DrawImage( bgMenu,new Vec2( 0,0 ) );
		m.DrawMenu( gfx );
		gfx.DrawImage( startScreen,new Vec2( 0,0 ) );
		start.Draw( gfx );
		
		if( fadeoutOpacity < opacityGainRate * 2 )
		{
			fadeoutOpacity = opacityGainRate * 2;
		}
		else
		{
			fadeoutOpacity -= opacityGainRate;
		}
		gfx.SetAlpha( fadeoutOpacity );
		gfx.DrawRect( new Vec2( 0,0 ),
			new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),"black" );
		gfx.SetAlpha( 1.0 );
	}
}
})()