var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var taskReportsSchema = new Schema({
	reportName            :		{	type: String, required: true},
  employeeId            :		{	type: String, required: true},
  text                  :		{	type: String, required: true},
});


module.exports = mongoose.model('TaskReports', taskReportsSchema);
