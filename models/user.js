const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt'); // A native JS bcrypt library for NodeJS



// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
    if (!email) {
      return false; 
    } else {
      if (email.length < 5 || email.length > 30) {
        return false; 
      } else {
        return true; 
      }
    }
  };
  
  // Validate Function to check if valid e-mail format
  let validEmailChecker = (email) => {
    if (!email) {
      return false; 
    } else {
      const regExp = new RegExp(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      return regExp.test(email); 
    }
  };
  
  // Array of Email Validators
  const emailValidators = [
    // {
    //   validator: emailLengthChecker,
    //   message: 'E-mail must be at least 5 characters but no more than 30'
    // },
    // {
    //   validator: validEmailChecker,
    //   message: 'Must be a valid e-mail'
    // }
  ];
  
  // Validate Function to check username length
  let usernameLengthChecker = (username) => {
    if (!username) {
      return false; 
    } else {
      if (username.length < 3 || username.length > 15) {
        return false;
      } else {
        return true; 
      }
    }
  };
  
  // Validate Function to check if valid username format
  let validUsername = (username) => {
    if (!username) {
      return false; 
    } else {
      const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
      return regExp.test(username); 
    }
  };
  
  // Array of Username validators
  const usernameValidators = [
    {
      validator: usernameLengthChecker,
      message: 'Username must be at least 3 characters but no more than 15'
    },
    {
      validator: validUsername,
      message: 'Username must not have any special characters'
    }
  ];
  
  // Validate Function to check password length
  let passwordLengthChecker = (password) => {
    if (!password) {
      return false; 
    } else {
      if (password.length < 8 || password.length > 35) {
        return false;
      } else {
        return true; 
      }
    }
  };
  
  // Validate Function to check if valid password format
  let validPassword = (password) => {
    if (!password) {
      return false; 
    } else {
      const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
      return regExp.test(password);
    }
  };
  
  // Array of Password validators
  const passwordValidators = [
    // {
    //   validator: passwordLengthChecker,
    //   message: 'Password must be at least 8 characters but no more than 35'
    // },
    // {
    //   validator: validPassword,
    //   message: 'Password Must have at least one uppercase, lowercase, special character, and number'
    // }
  ];



// User Model Definition
const userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators },
    role: {type: String, lowercase: true, required: false}
});


// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = (p1, p2) => {
  console.log(p1,p2);
  return bcrypt.compareSync(p1, p2); 
};
module.exports = mongoose.model('User', userSchema);