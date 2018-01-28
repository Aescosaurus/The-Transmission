function Keyboard()
{
	function KeyPress( e )
	{
		this.key = e.key.toUpperCase();
		this.keyCode = e.keyCode;
	}
	// 
	let keyMap = [];
	let pressedKeys = [];
	
	let nKeysPressed = 0;
	// 
	this.Start=()=>
	{
		onkeydown = onkeyup = ( e ) =>
		{
			const keyIsPressed = ( e.type == 'keydown' );
			keyMap[e.keyCode] = keyIsPressed;
			
			if( keyIsPressed )
			{
				++nKeysPressed;
				
				pressedKeys.push( new KeyPress( e ) );
			}
			else if( nKeysPressed > 0 )
			{
				--nKeysPressed;
				
				for( let i = 0; i < pressedKeys.length; ++i )
				{
					if( pressedKeys[i].keyCode == e.keyCode )
					{
						pressedKeys.splice( i,1 );
					}
				}
			}
		}
	}
	
	this.KeyDown=( key )=>
	{
		if( typeof( key ) === 'string' )
		{
			key = key.charCodeAt( 0 );
		}
		
		return keyMap[key];
	}
	
	this.AnyKey=()=>
	{
		return nKeysPressed > 0;
	}
	
	this.ActiveKeys=()=>
	{
		return pressedKeys;
	}
}