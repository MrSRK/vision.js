const mongoose=require('mongoose')
require('mongoose-schema-jsonschema')(mongoose);
/**
 * Connect to MongoDB.
 * @param {Function} next Callback function
 * @callback function(error,data)
 * @throws error
 * @returns {Boolean} Function status
 */
const connect=next=>
{
	try
	{
		mongoose.set('useFindAndModify',false)
		mongoose.set('useCreateIndex',true)
		mongoose.set('useNewUrlParser',true)
		return mongoose.connect(process.env.MONGODB_URI,error=>
		{
			return next(error,mongoose)
		})
	}
	catch(error)
	{
		console.log(error)
		return next(error)
	}

}
module.exports.connect=connect