function Vec2( x = 0,y = 0,isConst = false )
{
	this.x = x;
	this.y = y;
	const myX = x;
	const myY = y;
	// 
	this.Add=( other )=>
	{
		if( isConst )
		{
			console.log( "Attempt to add to const Vec2 cancelled!" );
		}
		else
		{
			this.x += other.x;
			this.y += other.y;
		}
		
		return this;
	}
	
	this.GetAdded=( other )=>
	{
		if( !isConst )
		{
			return( new Vec2( this.x + other.x,this.y + other.y ) );
		}
		else
		{
			return( new Vec2( myX + other.x,myY + other.y ) );
		}
	}
	
	this.Subtract=( other )=>
	{
		if( isConst )
		{
			console.log( "Attempt to subtract from const Vec2 cancelled!" );
		}
		else
		{
			this.x -= other.x;
			this.y -= other.y;
		}
		
		return this;
	}
	
	this.GetSubtracted=( other )=>
	{
		if( !isConst )
		{
			return( new Vec2( this.x - other.x,this.y - other.y ) );
		}
		else
		{
			return( new Vec2( myX - other.x,myY - other.y ) );
		}
	}
	
	this.Multiply=( amount )=>
	{
		if( isConst )
		{
			console.log( "Attempt to multiply const Vec2 cancelled!" );
		}
		else
		{
			this.x *= amount;
			this.y *= amount;
		}
		
		return this;
	}
	
	this.GetMultiplied=( amount )=>
	{
		if( !isConst )
		{
			return( new Vec2( this.x * amount,this.y * amount ) );
		}
		else
		{
			return( new Vec2( myX * amount,myY * amount ) );
		}
	}
	
	this.Divide=( amount )=>
	{
		if( isConst )
		{
			console.log( "Attempt to divide const Vec2 cancelled!" );
		}
		else
		{
			this.x /= amount;
			this.y /= amount;
		}
		
		return this;
	}
	
	this.GetDivided=( amount )=>
	{
		return( new Vec2( this.x / amount,this.y / amount ) );
	}
	
	this.Normalize=()=>
	{
		if( isConst )
		{
			console.log( "Attempt to normalize const Vec2 cancelled!" );
		}
		else
		{
			const div = Math.sqrt( this.x * this.x + this.y * this.y );
			if( div === 0 )
			{
				return;
			}
			
			this.x = this.x / div;
			this.y = this.y / div;
		}
		
		return this;
	}
	
	this.GetNormalized=()=>
	{
		const div = Math.sqrt( this.x * this.x + this.y * this.y );
		if( div === 0 )
		{
			return;
		}
		
		return( new Vec2( this.x / div,this.y / div ) );
	}
	
	this.GetLengthSq=()=>
	{
		return( x * x + y * y );
	}
	
	this.GetLength=()=>
	{
		return Math.sqrt( this.GetLengthSq() );
	}
	
	this.Equals=( other )=>
	{
		return( this.x == other.x && this.y == other.y );
	}
}