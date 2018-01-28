function AAudio()
{
	let sounds = [];
	let curSound = 0;
	//
	this.LoadSound=( source )=>
	{
		// const nowSound = curSound;
		// ++curSound;
		// sounds[nowSound] = new Audio( source );
		// return nowSound;
		
		for( let i = 0; i < sounds.length; ++i )
		{
			const temp = new Audio( source );
			if( sounds[i].src == temp.src )
			{
				return i;
			}
		}
		
		sounds.push( new Audio( source ) );
		
		return( sounds.length - 1 );
	}

	this.PlaySound=( id,vol = 1.0 )=>
	{
		sounds[id].volume = vol;
		sounds[id].loop = false;
		sounds[id].currentTime = 0;
		sounds[id].play();
	}
	
	this.LoopSound=( id,vol = 1.0 )=>
	{
		sounds[id].volume = vol;
		sounds[id].loop = true;
		sounds[id].currentTime = 0;
		sounds[id].play();
	}
	
	this.StopSound=( id )=>
	{
		sounds[id].loop = false;
		sounds[id].pause();
		sounds[id].currentTime = 0;
	}

	this.StopAll=()=>
	{
		for( let i in sounds )
		{
			sounds[id].loop = false;
			sounds[i].pause();
			sounds[i].currentTime = 0;
		}
	}
	
	this.IsPlaying=( id )=>
	{
		return !sounds[id].paused;
	}
}