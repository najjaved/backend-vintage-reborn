const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Pages is required.'],
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required.'],
      trim: true,
    },
    phone: {
      type: Number,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      lowercase: true,
      trim: true,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
)

const User = model('User', userSchema)

module.exports = User
