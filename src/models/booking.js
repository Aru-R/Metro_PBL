const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    pass_type: {
        type: String,
        required: true,
    },
    purchase_date: {
        type: Date,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});


const Pass = mongoose.model('Pass', passSchema)

module.exports = Pass;