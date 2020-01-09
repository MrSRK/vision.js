const morgan=require('morgan')
const rfs=require('rotating-file-stream')
const fs = require('fs')
const path = require('path')
/**
 * Set loget to console if mode is development or else to access log file at log directory
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const setLoger=async(next)=>
{
	try
	{
		if(process.env.NODE_ENV==='development')
			return next(null,morgan('dev'))
		const logDirectory=path.join(__dirname, '../log')
		const options={
			interval:'1d',
			path:logDirectory
		}
		fs.exists(logDirectory,exists=>
		{
			if(!exists)
				fs.mkdir(logDirectory,{recursive:true},error=>
				{
					if(error)
						throw(error)
					const accessLogStream=rfs('access.log',options)
					return next(null,morgan('combined',{stream:accessLogStream}))
				})
			else
			{
				const accessLogStream=rfs('access.log',options)
				return next(null,morgan('combined',{stream:accessLogStream}))
			}
		})
	}
	catch(error)
	{
		return next(error)
	}
}
module.exports.setLoger=setLoger