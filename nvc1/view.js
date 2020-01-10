const fs=require('fs')
const path=require('path')
/**
 * Collect all view direcroties for main and sub-modules and return them as array of string paths
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const __construct=next=>
{
	let views=[]
	try
	{
		return getNvc1GlobalViews((error,nvcgv)=>
		{
			if(error)
				throw(error)
			if(nvcgv)
				views=views.concat(nvcgv)
			return getModulesViews((error,mv)=>
			{
				if(error)
					throw(error)
				if(mv)
					views=views.concat(mv)
				return next(null,views)
			})
		})
	}
	catch(error)
	{
		return next(error,views)
	}
}
/**
 * Collect view direcroties for all mudules (if any)
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const getModulesViews=next=>
{
	try
	{
		const p=process.env.NVC1_MODULE_PATH || './modules'
		const nvc1ModulesPath=path.join(process.mainModule.path,p)
		return fs.exists(nvc1ModulesPath,exists=>
		{
			let views=[]
			if(exists)
				return fs.readdir(nvc1ModulesPath,(error,files)=>
				{
					if(error)
						throw(error)
					for(let i=0;i<files.length;i++)
						if(fs.existsSync(nvc1ModulesPath+'\\'+files[i]+'\\views'))
							views[views.length]=nvc1ModulesPath+'\\'+files[i]+'\\views'
					return next(null,views)
				})
		})
	}
	catch(error)
	{
		return next(error,null)
	}
}
/**
 * Collect view global direcroties (if any)
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const getNvc1GlobalViews=next=>
{
	try
	{
		const p=process.env.NVC1_GLOBAL_VIEW_PATH || './views'
		let nvc1ViewsPath=path.join(process.mainModule.path,p)
		return fs.exists(nvc1ViewsPath,exists=>
		{
			if(exists)
				return next(null,[nvc1ViewsPath])
		})
	}
	catch(error)
	{
		return next(error,[])
	}
}
module.exports=__construct