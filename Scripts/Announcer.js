function Announcer( gfx )
{
	const dirMessages =
	[
		{ m: "Mysterious Voice: I'm North of your position!" },
		{ m: "Mysterious Voice: I am South of your position!" },
		{ m: "Mysterious Voice: I'm West of your position!" },
		{ m: "Mysterious Voice: I am East of your position!" },
		{ m: "Mysterious Voice: I am Northeast of your position!" },
		{ m: "Mysterious Voice: I am Southeast of your position!" },
		{ m: "Mysterious Voice: I'm Southwest of your position!" },
		{ m: "Mysterious Voice: I'm Northwest of your position!" },
		{ m: "Mysterious Voice: Great, you made it! Now save me!!" },
		{ m: "< S T A T I C >" }
	];
	let curMessage = "";
	let opacity = 1.0;
	const lossRate = 0.003;
	const fastLossRate = 0.03;
	
	const pos = new Vec2( 80,gfx.ScreenHeight - 50 );
	const textPos = pos.GetAdded( new Vec2( 10,40 ) );
	const size = new Vec2( gfx.ScreenWidth - 100,100 );
	// 
	this.Draw=( gfx )=>
	{
		if( opacity > fastLossRate )
		{
			if( opacity > 0.5 )
			{
				opacity -= lossRate;
			}
			else
			{
				opacity -= fastLossRate;
			}
			// gfx.DrawRect( pos,size,"#566" );
			gfx.SetAlpha( opacity );
			gfx.DrawText( textPos,"20PX Arial","#FFF",curMessage );
			gfx.SetAlpha( 1.0 );
		}
	}
	
	this.SendPosMessage=( curPos,target )=>
	{
		opacity = 1.0;
		let where = 0;
		if( target.Equals( curPos ) )
		{
			where = 8;
		}
		if( target.y < curPos.y )
		{
			where = 0;
		}
		if( target.y > curPos.y )
		{
			where = 1;
		}
		if( target.x < curPos.x )
		{
			where = 2;
		}
		if( target.x > curPos.x )
		{
			where = 3;
		}
		if( target.y < curPos.y && target.x > curPos.x )
		{
			where = 4;
		}
		if( target.y > curPos.y && target.x > curPos.x )
		{
			where = 5;
		}
		if( target.y > curPos.y && target.x < curPos.x )
		{
			where = 6;
		}
		if( target.y < curPos.y && target.x < curPos.x )
		{
			where = 7;
		}
		
		curMessage = dirMessages[where].m;
	}
	
	this.SendIntroMessage=()=>
	{
		curMessage = "Mysterious Voice: Travel to the edge and save me!";
	}
}