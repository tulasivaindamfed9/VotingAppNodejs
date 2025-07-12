// importin mongoose
const mongoose = require("mongoose");
// import bcrypt
const bcrypt=require('bcrypt')

// now defining the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  aadharNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

// defing 'pre' middleware fun for bcrypt(password hash)
userSchema.pre("save", async function (next) {
  const user = this; //for every user entering

  // Hash the password only if the user is new or user modifying password
  if (!user.isModified("password")) return next();
  try {
    //    hash password generation using salt
    const salt = await bcrypt.genSalt(10); //generate salt pass of length 10

    //  hash password
    const hashPassword = await bcrypt.hash(user.password, salt);

    // new password with hash included is saved to password provided by user
    user.password = hashPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// comparing the user provided password with stored password using compare fun. fun name is comparePassword
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    //   use bcrypt to compare the provided password with hashed password
    // existing password ---> kfjsdf3223rvsjfs -----> extract salt
    // extract salt + new hased password === existing password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// our schema is ready, now to want to define model to crud operations
const user = mongoose.model("user", userSchema);
module.exports = user;
