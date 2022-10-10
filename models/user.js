import { Schema, model } from 'mongoose';
import { isURL, isEmail } from 'validator';
import { compare } from 'bcryptjs';
import UnauthorizedError from '../error/unauthorized-errors';

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        isURL(v, { require_protocol: true });
        return /https?:\/\/(www\.)?\d?\D{1,}#?/.test(v);
      },
    },
    message: (props) => `${props.value} неверный адрес`,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Неверный адрес электронной почты'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line new-cap
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // eslint-disable-next-line new-cap
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};
export default model('user', userSchema);