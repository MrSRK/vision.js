const mongoose=require('mongoose')
require('mongoose-schema-jsonschema')(mongoose)
const chalk=require('chalk')
const Singleton=class
{
	constructor()
	{
		try
		{
			if(!Singleton.instance)
				Singleton.instance=new database()
		}
		catch(error)
		{
			console.log(error)
		}
	}
	set=next=>
	{
		return Singleton.instance.connect(error=>
		{
			return  next(error,true)
		})
	}
}
const database=class
{
	connection={}
	constructor()
	{
		try
		{
			this.connection.uri=process.env.MONGODB_URI
			this.connection.options={
				useFindAndModify:false,
				useCreateIndex:true,
				useNewUrlParser:true,
				useUnifiedTopology:true
			}
		}
		catch(error)
		{
			console.log(error)
		}
	}
	connect=next=>
	{
		try
		{
			if(typeof this.connection.uri==undefined || !this.connection.uri)
				throw new Error(chalk.red('MongoDB URI not set'))
			return mongoose.connect(this.connection.uri,this.connection.options,error=>
			{
				return next(error)
			})
		}
		catch(error)
		{
			return next(error)
		}
	}
}
module.exports=Singleton