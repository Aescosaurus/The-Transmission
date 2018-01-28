function Example()
{
	GameObject.call( this );
	
	// 
	this.Start=( gfx )=>
	{
		this.pos = new Vec2( gfx.ScreenWidth / 2,gfx.ScreenHeight / 2 );
	}
	
	this.Update=( ms )=>
	{
		this.pos = ms.GetPos();
	}
	
	this.Draw=( gfx )=> // Overridden.
	{
		gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ),this.size,"#0FF" );
	}
}