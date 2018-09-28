const User = require('../models/user');
const bcrypt = require('bcrypt'); // A native JS bcrypt library for NodeJS
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.json({ success: false, message: 'You must provide an e-mail' }); 
        }
        else {
            if (!req.body.username) {
                res.json({ success: false, message: 'You must provide username' }); 
            }
            else{
                if (!req.body.password) {
                    res.json({ success: false, message: 'You must provide password' });
                }
                else {
                  let user;
                  if(req.body.role) {
                    console.log("adfd");
                    user = new User({
                      email: req.body.email.toLowerCase(),
                      username: req.body.username.toLowerCase(),
                      password: req.body.password,
                      role: req.body.role.toLowerCase()
                    });
                  }
                  else {
                    user = new User({
                      email: req.body.email.toLowerCase(),
                      username: req.body.username.toLowerCase(),
                      password: req.body.password
                    });
                  }
                    console.log(user);
                    user.password = bcrypt.hashSync( user.password, 10);
                    
                    // Save user to database
                    user.save((err) => { 
                        if(err){
                            if (err.code === 11000) {
                                res.json({ success: false, message: 'Username or e-mail already exists' }); 
                            } else {
                                if (err.errors) {
                                    // Check if validation error is in the email field
                                    if (err.errors.email) {
                                      res.json({ success: false, message: err.errors.email.message }); // Return error
                                    } else {
                                      // Check if validation error is in the username field
                                      if (err.errors.username) {
                                        res.json({ success: false, message: err.errors.username.message }); // Return error
                                      } else {
                                        // Check if validation error is in the password field
                                        if (err.errors.password) {
                                          res.json({ success: false, message: err.errors.password.message }); // Return error
                                        } else {
                                          res.json({ success: false, message: err }); // Return any other error not already covered
                                        }
                                      }
                                    }
                                } else {
                                    res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                                  }
                            }
                            
                        }
                        else{
                            res.json({ success: true, message: 'User Saved' });
                        }
                    });
                }
            }
        } 

    });

    router.get('/checkEmail/:email', (req, res) => {
        // Check if email was provided in paramaters
        if (!req.params.email) {
          res.json({ success: false, message: 'E-mail was not provided' }); // Return error
        } else {
          // Search for user's e-mail in database;
          User.findOne({ email: req.params.email }, (err, user) => {
            if (err) {
              res.json({ success: false, message: err }); // Return connection error
            } else {
              // Check if user's e-mail is taken
              if (user) {
                res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
              } else {
                res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
              }
            }
          });
        }
      });

    router.get('/checkUsername/:username', (req, res) => {
        // Check if username was provided in paramaters
        if (!req.params.username) {
            res.json({ success: false, message: 'Username was not provided' }); // Return error
        } else {
            // Look for username in database
            User.findOne({ username: req.params.username }, (err, user) => {
            // Check if connection error was found
            if (err) {
                res.json({ success: false, message: err }); // Return connection error
            } else {
                // Check if user's username was found
                if (user) {
                res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
                } else {
                res.json({ success: true, message: 'Username is available' }); // Return as vailable username
                }
            }
            });
        }
    });  

    router.post('/login', (req, res) => {
        // Check if username was provided
        if (!req.body.username) {
          res.json({ success: false, message: 'No username was provided' }); // Return error
        } else {
          // Check if password was provided
          if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided.' }); // Return error
          } else {
            // Check if username exists in database
            User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error
              } else {
                // Check if username was found
                if (!user) {
                  let obj = { success: false, message: 'Username not found.' };
                  res.json(obj); // Return error
                } else {
                  if(user.comparePassword(req.body.password, user.password)){
                    const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
                    res.json({ success: true, message: 'Success!', token: token, username: user.username, role: user.role  }); // Return success and token to frontend
                  }
                  else {
                    res.json({ success: false, message: 'Password invalid' }); // Return error
                  } 
                }
              }
            });
          }
        }
      });

    return router;
}