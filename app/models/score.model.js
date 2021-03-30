const mongoose = require('mongoose');

const ScoreSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    score: [{
        type: Number,
        require: true,
    }],
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Score', ScoreSchema);