const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


router.get("/profile", async(req,res)=>{

try{

const token =
req.headers.authorization.split(" ")[1];


const decoded =
jwt.verify(token,"secret123");


const user =
await User.findById(decoded.id)
.select("-password");


res.json(user);


}
catch(error){

res.status(500).json({
message:error.message
});

}

});


module.exports = router;