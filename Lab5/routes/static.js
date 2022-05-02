const express = require("express");
const { add } = require("nconf");
const app = express();
const router = express.Router();

// static routes

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/home");
  }
  res.render("index.html");
});

router.get("/home", function (req, res) {
  if (req.session.user) {
    // set Date of Birth, City of Birth, Email, Address, Gender, Hobbies, 
    // Civil state, Profession, Salary per year, upload a picture, and favourite sport
    // if they dont exist, set default value to None
    var name = req.session.user.name || "None";
    var dob = req.session.user.dob || null;
    var city = req.session.user.city ||"None";
    var email = req.session.user.email || "None";
    var address = req.session.user.address || "None";
    var gender = req.session.user.gender || "None";
    var hobbies = req.session.user.hobbies ||"None";
    var civilS = req.session.user.civilS || "None";
    var job = req.session.user.job || "None";
    var salary = req.session.user.salary || "None";
    var picture = req.session.user.picture || "None";
    var sport = req.session.user.sport || "None";


    return res.render("home.html", { 
      name: name, dob: dob, city: city, email: email, address: address, gender: gender, 
      hobbies: hobbies, civilS: civilS, job: job, salary: salary, picture: picture, 
      sport: sport,
    });

  }
  res.redirect("/");
});

module.exports = router;
