const morgan=require('morgan')
const rfs=require('rotating-file-stream')
const uuid=require('uuid/v1')
const fs=require('fs')
const path=require('path')
const Singleton=class
{
	constructor()
	{
		try
		{
			if(!Singleton.instance)
				Singleton.instance=new logger()
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
const logger=class
{
    settings={
        set:false,
        log:false,
        mode:'tiny',
        token:false
    }
    constructor()
    {
        if(process.env.NODE_ENV==='development')
            this.settings={
                set:true,
                log:false,
                mode:'dev',
                token:false
            }
        if(process.env.NODE_ENV==='production')
            this.settings={
                set:true,
                log:true,
                mode:':id :date[iso] :remote-addr :remote-user :method :url HTTP/:http-version :referrer :status :res[content-length] - :response-time ms :user-agent',
                token:true
            }
    }
    set=(app,next)=>
    {
        try
        {
            if(!this.settings.set)
                return next(null,false)
            if(this.settings.token)
                morgan.token('id',_=>
                {
                    return uuid()
                })
            if(!this.settings.log)
            {
                app.use(morgan(this.settings.mode))
                return next(null,true)
            }
            const logDirectory=path.join(__dirname, '../log')
            const options={
                size:"10M",
                interval:'1d',
                compress: "gzip",
                path:logDirectory
            }
            if(!fs.existsSync(logDirectory))
                fs.mkdirSync(logDirectory,{recursive:true})
            const accessLogStream=rfs.createStream('access.log',options)
            app.use(morgan(this.settings.mode,{stream:accessLogStream}))
            return next(null,true)
        }
        catch(error)
        {
            return next(error)
        }
    }
}
module.exports=Singleton