const mongoose = require('mongoose');

const DeploymentSchema = new mongoose.Schema({
  title : {
    type     : String,
    required : true
  },
  description : {
    type : String
  },
  project : {
    type     : mongoose.Types.ObjectId,
    ref      : 'Project',
    required : true
  },
  author : {
    type     : mongoose.Types.ObjectId,
    ref      : 'User',
    required : true
  },
  date : {
    type     : String,
    required : true
  }
});


module.exports = mongoose.models.Deployment || mongoose.model('Deployment', DeploymentSchema);
