function Random(){}
	Random.Range=( min,max )=>
	{ // Auto range function.
		if( min % 1 == 0 && max % 1 == 0 )
		{ // Int
			return Random.RangeI( min,max );
		}
		else
		{ // Float
			return Random.RangeF( min,max );
		}
	}
	
	Random.RangeI=( min,max )=>
	{
		return( Math.floor( Math.random() * ( 1 + max - min ) ) + min );
	}
	
	Random.RangeF=( min,max )=>
	{
		return( ( Math.random() * ( max - min ) ) + min );
	}
	
	Random.Deviate=( amount,maxDeviation )=>
	{
		if( amount % 1 == 0 )
		{ // Int
			return Random.DeviateI( min,max );
		}
		else
		{ // Float
			return Random.DeviateF( min,max );
		}
	}
	
	Random.DeviateI=( amount,maxDeviation )=>
	{
		return( amount + Random.RangeI( -maxDeviation,maxDeviation ) );
	}
	
	Random.DeviateF=( amount,maxDeviation )=>
	{
		return( amount + Random.RangeF( -maxDeviation,maxDeviation ) );
	}
	
	Random.Chance=( percentChance )=>
	{
		return( Random.RangeF( 0,100 ) < percentChance );
	}
function Str(){}
	Str.FirstUpperCase=( str )=>
	{
		return( str.charAt( 0 ).toUpperCase() + str.slice( 1 ) );
	}