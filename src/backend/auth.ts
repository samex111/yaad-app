import type { NextFunction , Request ,Response } from "express";
import jwt from "jsonwebtoken"


export function userMiddleware(req:Request, res:Response, next:NextFunction){
const header = req.headers["authorization"];
const decoded = jwt.verify(header as string, "menhibatunga" );
if(decoded){
  // @ts-ignore
        req.userId = decoded.id;
 res.json({
    msg:"msg successfull"
 })
 next();
}
else {
        // If the token is invalid, send a 401 Unauthorized response.
        res.status(401).json({ message: "Unauthorized User" });
    }
}