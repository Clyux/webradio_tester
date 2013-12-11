'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Playlist Schema
 */
var PlaylistSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  items: [
    {
      provider: {
        type: String,
        default: ''
      },
      musicId: Number
    }
  ],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

/**
 * Validations
 */
PlaylistSchema.path('name').validate(function (name) {
  return name.length;
}, 'Title cannot be blank');

/*PlaylistSchema.path('items.id').validate(function (id) {
  return id.length;
}, 'Id of an item cannot be blank');*/

/**
 * Statics
 */
PlaylistSchema.statics = {
  load: function (id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'name lastname username').exec(cb);
  }
};

mongoose.model('Playlist', PlaylistSchema);