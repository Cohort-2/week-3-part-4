const { Router } = require("express");
const router = Router();
const { Admin, User, Course } = require("../db");
const userMiddleware = require("../middleware/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
jwtpassword = "secret";

// User Routes
router.post("/signup", async function (req, res) {
  // Implement user signup logic
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      msg: "Please provide all the required fields",
    });
  }
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return res.status(403).json({
      msg: "User already exists try using a different email",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await new User({
    username,
    password: hashedPassword,
  });

  await user.save();
  return res.status(200).json({
    msg: "User created successfully",
  });
});

router.post("/signin", async function (req, res) {
  // Implement admin signup logic
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      msg: "Please provide all the required fields",
    });
  }
  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(403).json({
      msg: "User not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(403).json({
      msg: "Invalid password",
    });
  }

  const token = jwt.sign({ username }, jwtpassword);
  res.json({
    msg: "User signed in successfully",
    token,
  });
});

router.get("/courses", userMiddleware, async function (req, res) {
  // Implement listing all courses logic
  Course.find({}).then((courses) => {
    return res.json(courses);
  });
});

router.post("/courses/:courseId", userMiddleware, async function (req, res) {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;
  try {
    await User.updateOne(
      {
        username: username,
      },
      {
        $push: {
          purchasedCourses: courseId,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({
    success: true,
    msg: "Course purchased successfully",
  });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const user = await User.findOne({
    username: req.headers.username,
  });
  console.log(user.purchasedCourses); // i have an array now i want to get all the courses for this user

  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  res.json({
    courses: courses,
  });
});

module.exports = router;
