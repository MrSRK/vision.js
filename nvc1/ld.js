const build=(type,modelName,data)=>
{
	if(type=="this-publisher")
	{
		return {
			"@context":"https://schema.org/",
			"@type":"Organization",
			"url":process.env.LD_HOST,
			"name":process.env.LD_PUBLISHER,
			"logo":process.env.LD_LOGO
		}
	}
	if(type=='article-list')
	{
		let r=[]
		data.forEach(el=>
		{
			r.push({
				"@context":"https://schema.org/",
				"@type":"Article",
				"headline":el.title||process.env.LD_ARTICLE_CREATOR,
				"description":el.description,
				"creator":build('person-single',modelName,{name:data.creator||process.env.LD_ARTICLE_CREATOR}),
				"publisher":build('organization-single',modelName,{url:process.env.LD_HOST}),
				"author":build('person-single',modelName,{name:data.publisher||process.env.LD_ARTICLE_CREATOR}),
				"image":(el.images.length>0)?process.env.LD_HOST+'/images/'+modelName+'/'+el._id+'/'+el.images[0].webp:null,
				"mainEntityOfPage":process.env.LD_HOST+'/'+modelName+'/'+el._id,
				"dateCreated":el.createdAt,
				"datePublished":el.createdAt,
				"dateModified":el.updatedAt
			})
		})
		return r
	}


	//Person  (Single)
	if(type=='person-single')
	{
		return {
			"@context":"https://schema.org/",
			"@type":"Person",
			"name":data.name,
		}
	}
	//Organization  (Single)
	if(type=='organization-single')
	{
		return {
			"@context":"https://schema.org/",
			"@type":"Organization",
			"url":data.url,
			"name":data.name,
			"logo":data.logo
		}
	}
}
module.exports.build=build