/**
 * Created by Daniel on 3/30/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var TaskSchema = new Schema({
    name: {
        type: String,
        required: 'Please provide a name'
    },
    description: {
        type: String,
        default: ""
    },
    deadline: {
        type: Date,
        required: 'Please provide a deadline'
    },
    completed: {
        type: Boolean,
        default: false
    },
    assignedUser: {
        type: String,
        default: ""
    },
    assignedUserName: {
        type: String,
        default: "unassigned"
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }

});

mongoose.model('Task', TaskSchema);