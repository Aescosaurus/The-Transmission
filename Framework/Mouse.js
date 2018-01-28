function Mouse()
{
	let pos = new Vec2( 0,0 );
	let isDown = false;
	
	// 
	this.Start=( canvas )=>
	{
		canvas.addEventListener( "mousedown",() =>
		{
			isDown = true;
		} );
		
		canvas.addEventListener( "mouseup",() =>
		{
			isDown = false;
		} );
		
		canvas.addEventListener( "mousemove",( e ) =>
		{
			const rect = canvas.getBoundingClientRect();
			const root = document.documentElement;
			pos.x = e.clientX - rect.left - root.scrollLeft;
			pos.y = e.clientY - rect.top - root.scrollTop;
		} );
		
		canvas.addEventListener( "touchmove",( e ) =>
		{
			e.preventDefault();
			pos.x = e.changedTouches[0].clientX;
			pos.y = e.changedTouches[0].clientY;
		} );
		
		canvas.addEventListener( "touchstart",( e ) =>
		{
			isDown = true;
		} );
		
		canvas.addEventListener( "touchend",( e ) =>
		{
			isDown = false;
		} );
	}
	
	this.GetPos=()=>
	{
		return pos;
	}
	
	this.IsDown=()=>
	{
		return isDown;
	}
}