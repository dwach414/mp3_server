/**
 * Created by Daniel on 3/30/15.
 */


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: 'Please provide a name'
    },
    email: {
        type: String,
        required: 'Please provide an email address',
        unique: 'This email address has already been used'
    },
    pendingTasks: [String],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', UserSchema);