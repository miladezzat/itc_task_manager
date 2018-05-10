var mongoose	= require('mongoose');
var Schema		= mongoose.Schema;

var ruleSchema = new Schema({
	ruleid   	 :		{	type: String, required: true},
	rulename   :		{	type: String, required: true}
});


module.exports = mongoose.model('Rule', ruleSchema);
