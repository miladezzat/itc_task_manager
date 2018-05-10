var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var projectReportsSchema = new Schema({
    reportName             :		{	type: String, required: true},
    ManagerId              :		{	type: String, required: true},
    tasks           	   :   	    [{ 	type: String }],
    employees              :   	    [{ 	type: String }]
});


module.exports = mongoose.model('ProjectReports', projectReportsSchema);
