var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name :{
        type : String,
        required: true
    },
    age: Number,
    favoriteFoods: {
        type: Array,
        of: String
    }
});

module.exports = mongoose.model('Person', PersonSchema);