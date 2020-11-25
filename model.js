const mongoose =  require('mongoose');

const schema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // data: [mongoose.Schema.Types.Mixed]
},{strict: false});

module.exports = mongoose.model('Item', schema);
