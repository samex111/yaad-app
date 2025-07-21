import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import z from "zod/v4";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
const JWT_SECRET = "mesiniordeveloperbnaunga";
import { UserModel, ContentModel ,LinkModel } from "./db.ts"
import { userMiddleware } from "./auth.ts";
import { random } from "./hash.ts";
const app = express();
app.use(express.json());
mongoose.connect("mongodb+srv://samxpatel2:UT89c7QfQQArJGgf@cluster0.fp0dl9k.mongodb.net/second-brain")

app.post('/api/v1/signup', async (req: Request, res: Response) => {
  const requireBody = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(8).max(100)
  });
  const parseDataSucess = requireBody.safeParse(req.body);
  if (!parseDataSucess.success) {
    return res.status(403).json({
      msg: "invailid creditionl"
    });
  }
  const { username } = req.body;
  const { password } = req.body;

  const hassedPassword = await bcrypt.hash(password, 5);
  try {
    await UserModel.create({
      username,
      password: hassedPassword

    })
    res.json("User created");
    console.log(username + " " + hassedPassword)

  } catch (e) {
    res.status(403).json("user already exists");
    console.log(e)
  }

});


app.post("/api/v1/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(403).json({ msg: "User not found" });
    }
    console.log(user.password);
    // const passwordMatch = await bcrypt.compare(password, user.password);
    // if (!passwordMatch) {
    //   return res.status(403).json({ msg: "Invalid credentials" });
    // }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      msg: "Login successful",
      token: token
    });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error", err });
  }
});


app.post('/api/v1/content', userMiddleware, async function (req: Request, res: Response) {
  const { link, type, title } = req.body;
  await ContentModel.create({
    link,
    type,
    title,
    // @ts-ignore
    userID: req.userId
  })
  res.json("content added")

});


app.get('/api/v1/content', userMiddleware, async function (req: Request, res: Response) {
  // @ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({ userId: userId }).populate("userId", "username")
  res.json(content);
});


app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const { contentId } = req.body;
  // @ts-ignore
  await ContentModel.deleteMany({ contentId, userId: req.userId })
  res.json({
    msg: "Deleted"
  })
});

// Share content Link 
app.post("/api/v1/brain/share", userMiddleware, async (req, res) =>{
  const {share} = req.body
  if(share){
    // @ts-ignore
    const existingLink = await LinkModel.findOne({userId:req.userId});
    if(existingLink){
      res.json({hash:existingLink.hash});
      return;
    }
    const hash = random(10);
    // @ts-ignore
    await LinkModel.create({userId:req.userId , hash});
    res.json({hash})
  }

  else{
    // @ts-ignore
    await LinkModel.deleteOne({userId:req.userId})
    res.json({msg :"Removed link"})
    
  }
})
app.get("/api/v1/brain/:shareLink" , async (req,res) =>{
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({hash});
  if(!link){
    res.status(404).json({msg:"Invailid share link"});
    return;
  }
  const content = await ContentModel.find({userId:link.userId})
  const user = await UserModel.findOne({_id:link.userId});

  if(!user){
    res.status(404).json({msg:"User not found"});
    return;
  }

  res.json({
    username:user.username,
    content
  })
})

app.listen(3000, function () {
  console.log("server is running");
});
// how to do content management  