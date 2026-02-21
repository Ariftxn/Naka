import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.get("/", (req, res) => {
  res.render("index", { title: "Naka Dashboard" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Dashboard running at http://localhost:${process.env.PORT}`);
});