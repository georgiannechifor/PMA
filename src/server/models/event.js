const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title : {
    type     : String,
    required : true
  },
  author : {
    type     : mongoose.Schema.Types.ObjectId,
    required : true,
    ref      : 'User'
  },
  date : {
    type     : String,
    required : true
  },
  startTime : {
    type     : String,
    required : true
  },
  endTime : {
    type     : String,
    required : true
  },
  isRecurring : {
    type    : String,
    default : false
  },
  assignee : {
    type     : mongoose.Schema.Types.ObjectId,
    ref      : 'User',
    required : [function() { // eslint-disable-line
      return this.teamAssigned.length === 0;
    }]
  },
  teamAssigned : [{
    type     : String,
    required : function() {  // eslint-disable-line
      return typeof this.assignee === 'undefined';
    }
  }]
});


module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
