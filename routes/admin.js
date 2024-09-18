const { Router } = require("express");
const { Admin, Course, User } = require("../db");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const bcrypt = require("bcrypt");

// Admin Routes
router.post("/signup", async function (req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        msg: "Please provide all the required fields",
      });
    }

    const existingAdmin = await Admin.findOne({ username: username });

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        msg: "Admin already exists try using a different email",
      });
    }

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = new Admin({
      username: username,
      password: hashedPassword,
    });

    await admin.save();

    res.json({
      msg: "Admin created successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
});

router.post("/signin", async function (req, res) {
  // Implement admin signup logic
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        msg: "Please provide all the required fields",
      });
    }

    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      return res.status(403).json({
        success: false,
        msg: "Admin not found",
      });
    }

    ispasswordMatch = await bcrypt.compare(password, admin.password);

    if (!ispasswordMatch) {
      return res.status(403).json({
        success: false,
        msg: "Invalid password",
      });
    }

    const token = jwt.sign({ username: username }, jwtpassword);
    console.log(token);
    res.json({
      success: true,
      msg: "Admin signed in successfully",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
});

router.post("/courses", adminMiddleware, async function (req, res) {
  // Implement course creation logic
  try {
    const { title, description, imageLink, price } = req.body;
    const course = new Course({
      title,
      description,
      imageLink,
      price,
    });

    await course.save();

    return res.status(201).json({
      success: true,
      msg: "Course created successfully",
      courseId: course._id,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
});

router.get("/courses", adminMiddleware, async function (req, res) {
  // Implement fetching all courses logic
  try {
    const response = await Course.find();
    res.json({
      courses: response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Something went wrong with our server",
    });
  }
});

module.exports = router;
