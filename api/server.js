const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 30 } // 30 min
}));

// Serve public files
app.use(express.static(path.join(__dirname, "../public")));

// Middleware to protect private pages
function authRequired(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login.html");
}

// Serve private files with auth
app.use("/private", authRequired, express.static(path.join(__dirname, "../private-views")));

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Example hardcoded credentials
  if (username === "admin" && password === "1234") {
    req.session.user = username;
    return res.redirect("/private/dashboard.html");
  }
  res.send("Invalid credentials");
});

// Logout endpoint
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login.html");
  });
});

// Export for Vercel
module.exports = app;
