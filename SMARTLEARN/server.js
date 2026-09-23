const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return {
      users: [],
      courses: [],
      questions: [],
      importantQuestions: []
    };
  }

  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* HOME */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

/* HEALTH CHECK */
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    app: "SMARTLEARN",
    database: "local-json"
  });
});

/* REGISTER */
app.post("/register", (req, res) => {
  const data = readData();

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send("Please fill all fields");
  }

  const existingUser = data.users.find(
    user => user.email === email
  );

  if (existingUser) {
    return res.send("Email already registered");
  }

  data.users.push({
    id: Date.now().toString(),
    name,
    email,
    password
  });

  saveData(data);

  res.redirect("/login.html");
});

/* LOGIN */
app.post("/login", (req, res) => {
  const data = readData();

  const { email, password } = req.body;

  const user = data.users.find(
    user =>
      user.email === email &&
      user.password === password
  );

  if (user) {
    return res.sendFile(
      path.join(__dirname, "public", "dashboard.html")
    );
  }

  res.send("Invalid Login");
});

/* ADD QUESTION */
app.post("/addQuestion", (req, res) => {
  const data = readData();

  const question = {
    id: Date.now().toString(),
    topic: req.body.topic,
    question: req.body.question,
    option1: req.body.option1,
    option2: req.body.option2,
    option3: req.body.option3,
    option4: req.body.option4,
    answer: req.body.answer
  };

  data.questions.push(question);
  saveData(data);

  res.send("Question Added Successfully");
});

/* GET ALL QUESTIONS */
app.get("/questions", (req, res) => {
  const data = readData();
  res.json(data.questions);
});

/* GET QUESTIONS BY TOPIC */
app.get("/questions/:topic", (req, res) => {
  const data = readData();

  const questions = data.questions.filter(
    q => q.topic === req.params.topic
  );

  res.json(questions);
});

/* ADD IMPORTANT QUESTION */
app.post("/addImportantQuestion", (req, res) => {
  const data = readData();

  const question = {
    id: Date.now().toString(),
    topic: req.body.topic,
    question: req.body.question,
    answer: req.body.answer
  };

  data.importantQuestions.push(question);
  saveData(data);

  res.send("Important Question Added Successfully");
});

/* GET IMPORTANT QUESTIONS */
app.get("/importantQuestions/:topic", (req, res) => {
  const data = readData();

  const questions = data.importantQuestions.filter(
    q => q.topic === req.params.topic
  );

  res.json(questions);
});

/* ADD COURSE */
app.post("/addCourse", (req, res) => {
  const data = readData();

  const course = {
    id: Date.now().toString(),
    topic: req.body.topic,
    courseName: req.body.courseName,
    videoTitle: req.body.videoTitle,
    videoLink: req.body.videoLink,
    pdfLink: req.body.pdfLink,
    lectureNotes: req.body.lectureNotes
  };

  data.courses.push(course);
  saveData(data);

  res.send("Course Video Added Successfully");
});

/* GET ALL COURSES */
app.get("/courses", (req, res) => {
  const data = readData();
  res.json(data.courses);
});

/* GET COURSES BY TOPIC */
app.get("/courses/:topic", (req, res) => {
  const data = readData();

  const courses = data.courses.filter(
    course => course.topic === req.params.topic
  );

  res.json(courses);
});

/* GET TOPICS */
app.get("/topics", (req, res) => {
  const data = readData();

  const topics = [
    ...new Set(data.courses.map(course => course.topic))
  ];

  res.json(topics);
});

/* SUBMIT QUIZ */
app.post("/submitQuiz", (req, res) => {
  const data = readData();

  const questions = data.questions.filter(
    q => q.topic === req.body.topic
  );

  let score = 0;
  let attempted = 0;

  questions.forEach(q => {
    const submittedAnswer = req.body["q_" + q.id];

    if (submittedAnswer !== undefined) {
      attempted++;

      if (submittedAnswer === q.answer) {
        score++;
      }
    }
  });

  res.json({
    score,
    total: attempted
  });
});

/* DELETE ALL QUESTIONS */
app.get("/deleteQuestions", (req, res) => {
  const data = readData();

  data.questions = [];

  saveData(data);

  res.send("All Questions Deleted");
});

/* 404 */
app.use((req, res) => {
  res.status(404).send("Page not found");
});

/* START SERVER */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SMARTLEARN running on port ${PORT}`);
});
