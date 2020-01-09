const errorhandler=require('errorhandler')
const Singleton=class
{
	constructor()
	{
		try
		{
			if(!Singleton.instance)
				Singleton.instance=new handler()
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
const handler=class
{
	settings={
		set:false,
		env:'Unknown'
	}
    constructor()
    {
		try
		{
			if(process.env.NODE_ENV==='development')
				this.settings={
					set:true,
					env:'development'
				}
			else if(process.env.NODE_ENV==='production')
			this.settings={
				set:false,
				env:'production'
			}
		}
		catch(error)
		{
			console.log(error)
		}
	}
	set=(app,next)=>
	{
		try
		{
			if(!this.settings.set)
				return next(null,false)
			app.use(errorhandler())
			return next(null,true)
		}
		catch(error)
		{
			return next(error)
		}
	}
}
module.exports=Singleton