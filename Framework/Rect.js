function Rect( x,y,w,h )
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	// 
	this.Contains=( pos )=>
	{
		return( pos.x > this.x && pos.x < this.x + this.width &&
		        pos.y > this.y && pos.y < this.y + this.height );
	}
	
	this.IsContainedBy=( other )=>
	{
		return( this.x >= other.x && this.x + this.width <= other.x + other.width &&
			this.y >= other.y && this.y + this.height <= other.y + other.height );
	}
	
	this.Overlaps=( other )=>
	{
		return ( other.x < this.x + this.width && other.x + other.width > this.x &&
		         other.y < this.y + this.height && other.y + other.height > this.y );
	}
	
	this.MoveBy=( amount )=>
	{
		this.x += amount.x;
		this.y += amount.y;
	}
	
	this.MoveTo=( pos )=>
	{
		this.x = pos.x;
		this.y = pos.y;
	}
	
	this.GetMovedBy=( amount )=>
	{
		return( new Rect( this.x + amount.x,this.y + amount.y,
			this.width,this.height ) );
	}
}