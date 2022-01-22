const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name : {
    type     : String,
    required : [true, 'Please add a team name']
  }
});


module.exports = mongoose.models.Team || mongoose.model('Team', TeamSchema);
