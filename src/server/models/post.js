const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title : {
    type     : String,
    required : true
  },
  description : {
    type     : String,
    required : true
  },
  category : {
    type     : String,
    required : true
  },
  image : {
    type : String
  },
  content : {
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
  }
});


module.exports = mongoose.models.Post || mongoose.model('Post', PostSchema);
