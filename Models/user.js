const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
});

//match password check
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//hasing the passowrd before saving in the db, so the dba can't read whats the password
userSchema.pre("save", async function (next) {
  let user = this; //this is a reference to the document that we are currently working with
  if (!user.isModified("password")) return next(); //if there were no changes made to the field then just continue on

  //hash the password now
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
