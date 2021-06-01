const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User =  require('../model/userSchema');  // "User" is our collection, mernstack is our database
const authenticate = require('../middleware/athenticate');

// USING ASYNC AWAIT 
// FOR SIGN UP PAGE
router.post('/register', async (req,res) => {
   
    const { name, email, password, cpassword } = req.body;   // retrive all data from user

    if(!name || !email || !password || !cpassword){                  // check if all details are filled or not
        return res.status(422).json({ error: "Please fill all the details !" });
    }

    try{
        const userExist = await User.findOne({email:email});            // check if email already exists or not

        if(userExist){
            return res.status(422).json({ error: "Email already exists !" });
        }
        else{
            if(password !== cpassword){
                return res.status(422).json({ error: "Passwords are not matching !" });
            }
            else{
                const user = new User({ name, email, password, cpassword });   // store the document in collection
                //****  NOW PASSWORD HASHING IN userSchema.js file BEFORE user.save() ****/
                await user.save();
                res.status(201).json({ message: "User registered successfully !" });
            }
        }
    }
    catch(err){
        console.log(err);
    }
})

// FOR SIGN IN PAGE
router.post('/login', async (req, res) =>{

    const { email, password } = req.body;
  
    if(!email || !password){
        return res.status(422).json({ error: "Please fill all the details !" });
    }

    try{

        const findUser = await User.findOne({email:email});  // check if user already regestered
        
        if(!findUser){
            return res.status(400).json({ error: "Invalid credentials !" });  // when user is not found in db
        }
        else{
            const isPasswordMatch = await bcrypt.compare(password, findUser.password);  // check if entered password is correct
            if(!isPasswordMatch){
                return res.status(400).json({ error: "Invalid credentials !" });   // if wrong password is entered 
            }
            else{  
                let token = await findUser.generateAuthToken(); // generate token in userSchema.js file, save it to db.
                console.log(token);

                res.cookie('jwtoken', token, {
                    expires: new Date(Date.now() + 25892000000),   // cookie will expire after 25892000000 milisec = 30days after login
                    httpOnly:true                                  // then user have to again log in  
                });
                return res.status(200).json({ message: "Signed in successfully !" });
            }
        }
    }
    catch(err) {
        console.log(err);
    }
})

// FOR DASHBOARD
router.get('/dashboard', authenticate, (req, res) =>{               // here authenticate is a middleware which verifies token   
                                                                    // inside cookies with the token in the db else it will 
    return res.status(200).json({ message: "token verified !!" })   // redirect user to signin page.
});


// GET DATA FROM BACKEND TO HOMEPAGE
router.get('/getdata', authenticate, (req, res) =>{     // here authenticate is a middleware which verifies token   
                                                        // inside cookies with the token in the db else it will 
    res.send(req.rootUser);                              //  redirect user to signin page.
})


// FOR LOGOUT
router.get('/logout', (req, res) =>{
    console.log('logout page');
    res.clearCookie('jwtoken', { path:'/' });
    res.status(200).send('user logout');
});

module.exports = router;