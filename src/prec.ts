import jwt from "jsonwebtoken"
const JWT_SECRET = "dsbduch";
const email = "sameer@gmail.com"
const token = jwt.sign({
      email
    },JWT_SECRET);
    console.log( "token- -" +token);