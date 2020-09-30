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
	jpg:{type:String},
	jpgPath:{type:String},
	png:{type:String},
	pngPath:{type:String},
	size:{type:Number},
})
const schema=new mongoose.Schema({
	active:{type:Boolean,default:true},
	name:{type:String,required:true},
	title:{type:String,required:true},
	description:{type:String},
	text:{type:String},
	images:[image]
},
{
	timestamps:true,
	versionKey:false
})
const model=mongoose.model(modelName,schema)
module.exports.model=model
module.exports.schema=schema