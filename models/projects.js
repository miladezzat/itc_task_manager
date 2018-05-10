var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;


var projectSchema = new Schema({
	projectName         :		{	type: String, required: true},
  	projectManagerId    :		{	type: String, required: true},
  	startDate           :		{	type: String, required: true},
  	endDate             :		{	type: String, required: true},
  	employees           :   	[{ 	type: String }]
});


module.exports = mongoose.model('Project', projectSchema);
