function GameObject()
{
	this.pos = new Vec2( 0,0 );
	this.size = new Vec2( 50,50 );
	this.hitbox = new Rect( 0,0,0,0 );
	// 
	this.Draw=( gfx )=>
	{
		gfx.DrawRect( this.pos,this.size,"#F00" );
	}
	
	this.MoveTo=( newPos )=>
	{
		this.pos = newPos;
	}
	
	this.MoveBy=( amount )=>
	{
		this.pos += amount;
	}
	
	this.SetSize=( newSize )=>
	{
		this.size = newSize;
		this.hitbox.width = newSize.x;
		this.hitbox.height = newSize.y;
	}
	
	this.GetPos=()=>
	{
		return this.pos;
	}
	
	this.GetSize=()=>
	{
		return this.size;
	}
	
	this.GetRect=()=>
	{
		this.hitbox.MoveTo( this.pos );
		return this.hitbox;
	}
	
	this.Expose=()=>
	{
		console.log( "-----------" );
		console.log( "GAME OBJECT" );
		console.log( "-----------" );
		console.log( "POS: " + "x: " + this.pos.x + " y: " + this.pos.y );
		console.log( "SIZE: " + "w: " + this.size.x + " h: " + this.size.y );
		console.log( "RECT: " + "x: " + this.hitbox.x + " y: " + this.hitbox.y +
			" w: " + this.hitbox.width + " h: " + this.hitbox.height );
	}
}