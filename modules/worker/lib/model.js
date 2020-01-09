const mongoose=require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const modelName=__dirname.split("\\").reverse()[1]
const image=mongoose.Schema({
	fieldname:{type:String,required:true},
	originalname:{type:String},
	encoding:{type:String},
	mimetype:{type:String},
	destination:{type:String},
	filename:{type:String},
	path:{type:String},
	webp:{type:String},
	webpPath:{type:String},
	size:{type:Number},
})
const schema=new mongoose.Schema({
	active:{type:Boolean,default:true},
	name:{type:String},
	email:{type:String,required:true},
	password:{type:String,required:true},
	images:[image],
	leave_common:{type:Number,default:21},
	leave_medical:{type:Number,default:0},
	leave_spesial:{type:Number,default:0},
},
{
	timestamps:true,
	versionKey:false
})
/**
 * Pre all save executs to convert password to hash
 */
schema.pre('save',function save(next)
{
	const user=this
	if(!user.isModified('password'))
		return next()
	return bcrypt.genSalt(10,(error,salt)=>
	{
		if(error)
			return next(error)
		return bcrypt.hash(user.password,salt,null,(error,hash)=>
		{
			if(error)
				return next(error)
			user.password=hash
			return next()
		})
	})
})
const model=mongoose.model(modelName,schema)
module.exports.model=model
module.exports.schema=schema