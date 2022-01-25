const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name : {
    type     : String,
    required : [true, 'Please add a team name']
  },
  admin : {
    type     : mongoose.Schema.Types.ObjectId,
    ref      : 'User',
    required : [true, 'Please assign a admin for this tema']
  }
});


module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema);
