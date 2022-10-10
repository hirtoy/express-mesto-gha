import { Schema, model } from 'mongoose';
import { isURL } from 'validator';

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        isURL(v, { require_protocol: true });
        return /https?:\/\/(www\.)?\d?\D{1,}#?/.test(v);
      },
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model('card', cardSchema);