import mongoose from "mongoose";
// import Schema  from "mongoose";
const Schema = mongoose.Schema;
// import { ObjectId } from "mongoose";
const userSchema = new Schema({
     //  _id: { type: mongoose.Schema.Types.ObjectId },
     username: { unique: true,require:true, type: String },
     password: { require: true, type: String }
});
const contentSchema = new Schema({
     // _id: { type: mongoose.Schema.Types.ObjectId },
     type: { type: String },
     link: { type: String },
     title: { type: String },
     tag: { type: String }
})
const LinkSchema = new Schema({
     hash : String,
     // 
     userId : {type:mongoose.Types.ObjectId, ref: 'users', required:true, unique:true}

});
export const LinkModel = mongoose.model("links", LinkSchema)
export const UserModel = mongoose.model("users", userSchema);
export const ContentModel = mongoose.model("content", contentSchema);

