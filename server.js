// const express = require("express");
// const dotenv = require("dotenv").config();
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// mongoose
//   .connect(process.env.MOGO_URL)
//   .then(() => {
//     console.log("mongoose is connected");
//   })
//   .catch((err) => {
//     console.log("err", err);
//   });
// const app = express();
// app.set("view engine", "ejs");
// app.use(express.static("public"));
// app.get("/", (req, res) => {
//   res.send("hey renu32");
// });
// app.get("/mongo", (req, res) => {
//   res.render("sing");
// });
// app.get("/apple", (req, res) => {
//   res.render("logi");
// });
// app.get("/banana", (req, res) => {
//   res.render("dashboard");
// });
// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => {
//   console.log(`server is runing at server side${PORT}`);
// });
// const express = require("express");
// const dotenv = require("dotenv").config(); // Ensure dotenv is configured first
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const path = require("path");
// const ejs = require("ejs");
// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
// const User=require("./model/User")
// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Mongoose is connected");
//   })
//   .catch((err) => {
//     console.log("Error connecting to MongoDB:", err);
//   });
// const store = new MongoDBStore({
//   uri: process.env.MONGO_URL,
//   collection: "mySession1",
// });

// const app = express();

// // Middleware
// app.set("view engine", "ejs");
// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.set("views", path.join(__dirname, "views"));
// app.use(
//   session({
//     secret: "this is a secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(express.urlencoded({extended:true}))

// // Routes
// app.get("/", (req, res) => {
//   res.send("Hey Renu32");
// });

// app.get("/mango", (req, res) => {
//   res.render("Singup");
// });

// app.get("/apple", (req, res) => {
//   res.render("logi");
// });

// app.get("/banana", (req, res) => {
//   res.render("dashboard");
// });

// app.post("./Singup",async(req,res)=>{
//   const{username,password,email}=res.body
//   try{
//     const newUser=new User({
//       username,
//       password,
//       email
//     }) await newUser.save()
//     res.redirect("/logi")
//   }catch(err){
//     console.log(err)
//     res.redirect("/Singup")
//   }
// })
// const PORT = process.env.PORT || 9000;
// app.listen(PORT, () => {
//   console.log(`Server is running at port ${PORT}`);
// });
const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require("./model/User");
const bcrypt = require("bcrypt");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose is connected");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "mySessions",
});

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
const checkAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/mango");
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("Hey Renu32");
});

app.get("/mango", (req, res) => {
  res.render("Signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", checkAuth, (req, res) => {
  res.render("dashboard");
});
app.post("/Signup", async (req, res) => {
  const { username, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/mango");
  }
  const hashedpassword = await bcrypt.hash(password, 12);
  user = new User({
    username,
    email,
    password: hashedpassword,
  });
  req.session.person = user.username;
  await user.save();
  res.redirect("/login");
});
app.post("/user-login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.redirect("/mango");
  }
  const checkpassword = await bcrypt.compare(password, user.password);
  if (!checkpassword) {
    return res.redirect("/mango");
  }
  req.session.isAuthenticated = true;
  res.redirect("/dashboard");
});
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/mango");
  });
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
