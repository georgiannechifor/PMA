const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name : {
        type     : String,
        required : [true, 'Please add a project name']
    },
    description : {
      type : String
    },
    clientName : {
      type : String
    },
    team : {
      type     : mongoose.Schema.Types.ObjectId,
      ref      : 'Team',
      required : true,
    },
    deadline : {
      type     : String,
      required : true
    },
});

module.exports = mongoose.models.Project || mongoose.model(
'Project',
ProjectSchema
);
