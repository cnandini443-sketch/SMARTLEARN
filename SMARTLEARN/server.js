const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/smartlearnDB");

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);


/* question schema */

const questionSchema = new mongoose.Schema({
topic:String,
question:String,
option1:String,
option2:String,
option3:String,
option4:String,
answer:String
});

const Question = mongoose.model("Question", questionSchema);
app.post("/addQuestion", async (req,res)=>{

const q = new Question({
topic:req.body.topic,
question:req.body.question,
option1:req.body.option1,
option2:req.body.option2,
option3:req.body.option3,
option4:req.body.option4,
answer:req.body.answer
});

await q.save();

res.send("Question Added Successfully");

});
app.get("/questions", async (req,res)=>{

const questions = await Question.find();

res.json(questions);

});

// Important Question Schema
const importantQuestionSchema = new mongoose.Schema({
  topic: String,
  question: String,
  answer: String
});

const ImportantQuestion = mongoose.model("ImportantQuestion", importantQuestionSchema);

app.post("/addImportantQuestion", async (req, res) => {
  const iq = new ImportantQuestion({
    topic: req.body.topic,
    question: req.body.question,
    answer: req.body.answer
  });
  await iq.save();
  res.send("Important Question Added Successfully");
});

app.get("/importantQuestions/:topic", async (req, res) => {
  const iqs = await ImportantQuestion.find({topic: req.params.topic});
  res.json(iqs);
});

const courseSchema = new mongoose.Schema({
topic:String,
courseName:String,
videoTitle:String,
videoLink:String,
pdfLink:String,
lectureNotes:String
});

const Course = mongoose.model("Course", courseSchema);


// Register
app.post("/register", (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    res.redirect("/login.html");
  });
});

// Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email, password: password })
    .then(user => {
      if (user) {
        res.sendFile(path.join(__dirname, "public", "dashboard.html"));
      } else {
        res.send("Invalid Login");
      }
    });
});
app.post("/submitQuiz", async (req,res)=>{

const questions = await Question.find({topic: req.body.topic});

let score = 0;
let attempted = 0;

questions.forEach(q=>{

const submittedAnswer = req.body["q_" + q._id];
if (submittedAnswer !== undefined) {
  attempted++;
}

if(submittedAnswer === q.answer){
score++;
}

});

res.json({ score: score, total: attempted });

});

app.get("/courses", async (req,res)=>{

const courses = await Course.find();

res.json(courses);

});
app.post("/addCourse", async (req,res)=>{

const c = new Course({
topic:req.body.topic,
courseName:req.body.courseName,
videoTitle:req.body.videoTitle,
videoLink:req.body.videoLink,
pdfLink:req.body.pdfLink,
lectureNotes:req.body.lectureNotes
});

await c.save();

res.send("Course Video Added Successfully");

});
app.get("/deleteQuestions", async (req,res)=>{

await Question.deleteMany({});

res.send("All Questions Deleted");

});

app.get("/topics", async (req,res)=>{
const topics = await Course.distinct("topic");
res.json(topics);
});

app.get("/courses/:topic", async (req,res)=>{
const courses = await Course.find({topic: req.params.topic});
res.json(courses);
});

app.get("/questions/:topic", async (req,res)=>{
const questions = await Question.find({topic: req.params.topic});
res.json(questions);
});

const preferredPort = Number(process.env.PORT) || 3000;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on("error", error => {
    if (error.code === "EADDRINUSE") {
      console.warn(`Port ${port} is busy. Trying port ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    throw error;
  });
}

startServer(preferredPort);