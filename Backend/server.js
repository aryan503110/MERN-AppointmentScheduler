import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import Appointment from "./models/Appointment.js";
import User from "./models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
const PORT = 5000;

const app = express();

const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , './dist')));

app.get(/^(?!\/api).+/,(req,res)=>{
  res.sendFile(path.join(__dirname,'./dist/index.html'))
})

mongoose
  .connect("mongodb://localhost:27017/appointments", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((error) => console.log(error));

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json("The token is missing");
  } else {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.json("The token is wrong");
      } else {
        req.email = decoded.email;
        req.username = decoded.username;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ email: req.email, username: req.username });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "User Already Exist", success: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });
    await newUser.save();
    return res.json({ message: "User Created", success: true });
  } catch (error) {
    return res.json(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({ message: "Wrong Email or Password", success: false });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json({ message: "Wrong Email or Password", success: false });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username },
      'testkey',
      { expiresIn: "1d" }
    );
    res.cookie("token", token);
    return res.json({
      login: true,
      message: "Successfully Logged In",
      success: true,
    });
  } catch (error) {
    return res.json(error);
  }
});

app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    console.log(appointments);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/appointments", async (req, res) => {
  const { title, startTime, endTime, doctorId } = req.body;

  const appointment = new Appointment({
    title,
    startTime,
    endTime,
    doctorId,
  });

  try {
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/appointments/:id", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (erroror) {
    res.status(400).json({ message: erroror.message });
  }
});

app.delete("/appointments/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id
    );
    res.json(deletedAppointment);
  } catch (erroror) {
    res.status(400).json({ message: erroror.message });
  }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json("success");
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
