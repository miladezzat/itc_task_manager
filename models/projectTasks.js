var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;


var projecTaskstSchema = new Schema({
	projectId           :		{	type: String, required: true},
  	tasks           	:   	[{ 	type: String }]
});


module.exports = mongoose.model('ProjectTasks', projecTaskstSchema);
