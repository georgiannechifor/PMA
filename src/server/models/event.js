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
  backgroundColor : {
    type     : String,
    required : true
  },
  recurring : {
    startDate : {
      type     : String,
      required : true
    },
    endDate : {
      type : String
    },

    // Daily, weekly, monthly or yearly
    repeat : {
      type     : String,
      required : true
    },

    // MON TUE WED THU FRA SAT SUN
    byDay : {
      type     : String,
      required : true
    }
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
    ref      : 'Team',
    required : function() {  // eslint-disable-line
      return typeof this.assignee === 'undefined';
    }
  }]
});


module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
