var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var taskSchema = new Schema({
	projectId         	:		{	type: String, required: true},
	projectName         :		{	type: String, required: true},
	taskName 		    :		{	type: String, required: true},
	employeeId          :		{	type: String, required: true},
	employeeName        :		{	type: String, required: true},
	startDate           :		{	type: String, required: true},
  	EndDate             :		{	type: String, required: true},
	finshed				:		{	type: String },
	finshedTime			:		{ 	type: String}
});


module.exports = mongoose.model('Task', taskSchema);
