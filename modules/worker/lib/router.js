const router=require('express').Router()
const name=__filename.split('\\').reverse()[2]
const controller=require('./controller')
const config=require('../config.json')
const chalk=require('chalk')
let auth=[];

exports.getRouter=_=>
{
	try
	{
		return router
	}
	catch(error)
	{
		console.log(error)
		return null
	}
}
exports.setCoreController=coreController=>
{
	controller.setCoreController(coreController)
	auth=controller.authFunctionsObject(config.auth)
}
exports.route=(menu)=>
{
	try
	{
		Object.keys(config.routes).forEach(key=>
		{
			config.routes[key].forEach(r=>
			{
				if(r.pug)
				{
					router[r.method](r.route.replace('[name]',name),auth[r.auth],(req,res)=>
					{
						return controller.schema(schema=>
						{
							return res.status(200).render(r.pug,{
								title:r.title,
								menu:menu,
								root:name,
								schema:schema,
								user:key,
								_id:req.params._id||null,
								authModel:config.auth
							})
						})
					})
				}
				else
					router[r.method](r.route.replace('[name]',name),auth[r.auth+'Api'],(req,res)=>
					{
						return controller[r.function](req,res,name,(error,data,ld)=>
						{
							if(error)
								return res.status(500).json({status:false,data:data,ld:ld,error:error})
							if(!r.auth)
								return res.status(200).json({status:true,data:data,ld:ld,error:error})
							token=controller.refreshToken(req)
							return res.status(200).json({status:true,token:token,data:data,ld:ld,error:error})
						})
					})
			})
		})
	}
	catch(error)
	{
		console.log(error)
	}
}