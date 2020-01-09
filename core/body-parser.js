const bodyParser=require('body-parser')
const Singleton=class
{
	constructor()
	{
		try
		{
			if(!Singleton.instance)
				Singleton.instance=new parser()
		}
		catch(error)
		{
			console.log(error)
		}
	}
	set=(app,next)=>
	{
		return Singleton.instance.set(app,(error,flag)=>
		{
			return  next(error,flag)
		})
	}
}
const parser=class
{
	constructor()
	{

	}
	set=(app,next)=>
	{
		try
		{
			app.use(bodyParser.json())
			app.use(bodyParser.urlencoded({extended:true}))
			return next(null,true)
		}
		catch(error)
		{
			return next(error)
		}
	}
}
module.exports=Singleton