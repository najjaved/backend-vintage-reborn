const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { isAuthenticated } = require("../middleware/route-guard.middleware")
require("dotenv").config()
const router = require("express").Router()
const secret = require("../config/secretGenerator")
const { isAdmin } = require("../middleware/role-guard.middleware")

//All routes starts with /auth

router.get("/", (req, res) => {
    res.json("All good in auth")
})

// POST Signup
router.post("/signup", async(req, res, next) => {
    // const { username, password, email } = req.body;
    
    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
       
    try {
    if (!emailRegex.test(req.body.email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return next(new Error("Invalid email format"))
    }
  
    if (!passwordRegex.test(req.body.password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return next(new Error("Invalid password format"))
    }

 
    /* Check the users collection if a user with the same username already exists <ALREADY CHECKED THROUGH ERROR CODE 11000>
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        res.status(400).json({ message: "Username is taken." });
        return next(new Error("Username is taken"))
      } */
    
    // If the username is unique, proceed to hash the password
    const saltRounds  = 12;
    const salt = bcrypt.genSaltSync(saltRounds)
    const hashedPassword  = bcrypt.hashSync(req.body.password, salt)

    // Create a new user in the database
    const newUser = await User.create({ ...req.body, passwordHash: hashedPassword  })
    
    // Deconstruct the newly created user object to omit the password, we should never expose passwords publicly
    const { username, email, address, phone, role, _id } = newUser;
    // Create a new object that doesn't expose the password
    const user = { username, email, address, phone, role, _id };

    // Send a json response containing the user object without passowrd
    res.status(201).json({ user: user });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            res.status(409).json({ message: "Username already exists!" });
        }
        next(error)
    }
})

//POST login

router.post("/login", async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ username })
        // If user exists with this username
        if (foundUser) {
            // Compare the provided password with the one saved in the database to check if user has the correct credentials
            if (bcrypt.compareSync(password, foundUser.passwordHash)) {
                // Deconstruct the user object to omit the password before setting it as token payload
                const payload = {
                    userId: foundUser._id,
                    username: foundUser.username,
                    role: foundUser.role,
                  };

                // Create and sign the token
                const authToken  = jwt.sign(
                    payload, 
                    secret, 
                    {algorithm: "HS256",expiresIn: "1h",}
                );

                // Send the token as the response
                res.status(200).json({ token: authToken }); // { authToken: authToken } same as writng { authToken } since property key:value same
            } else {
                res.status(401).json({ message: "Unauthenticated: Username or password incorrect" })
            }
        }
        else {
            // If the user is not found, send an error response
            res.status(401).json({ message: "User not found." }) // repsonse on Frontend
            return next(new Error("User not found")) // pass error to the error handler

        } 

    } catch (error) {
        next(error)
    }
})

// GET verified: customer
router.get("/verify", isAuthenticated, (req, res, next) => {
    res.status(200).json({message: 'Login verified', tokenPayload: req.tokenPayload});
})

// GET verified: admin
router.get("/verify/admin",isAuthenticated, isAdmin, (req, res, next) => {
    res.status(200).json({ message: 'Admin verified', tokenPayload: req.tokenPayload });
  }
);


module.exports = router

