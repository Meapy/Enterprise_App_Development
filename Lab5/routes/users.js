const express = require("express");
const app = express();
const router = express.Router();
const joi = require("@hapi/joi");
const models = require("../models/users");

router.post("/login", async (req, res) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().min(6).max(20).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserLogin = await models.verifyUser(result.value);
    if (checkUserLogin.error) {
      throw checkUserLogin.message;
    }
    // set session for the logged in user
    req.session.user = {
      name: checkUserLogin.data.name,
      email: checkUserLogin.data.email,
    };
    res.json(checkUserLogin);
  } catch (e) {
    res.json({ error: true, message: e });
  }
});

router.post("/register", async (req, res) => {
  try {
    const schema = joi.object().keys({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).max(20).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserRegister = await models.registerUser(result.value);
    if (checkUserRegister.error) {
      throw checkUserRegister.message;
    }
    res.json(checkUserRegister);
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: e });
  }
});
//function to get data from client and save to database based on user signed in
router.post("/update", async (req, res) => {
  try {
    const schema = joi.object().keys({
      name: joi.string().required(),
      email: joi.string().email().required(),
      dob: joi.string().required(),
      city: joi.string().required(),
      address: joi.string().required(),
      gender: joi.string().required(),
      hobbies: joi.string().required(),
      civilS: joi.string().required(),
      job: joi.string().required(),
      salary: joi.string().required(),
      picture: joi.string().required(),
      sport: joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserUpdate = await models.updateUser(result.value);
    if (checkUserUpdate.error) {
      throw checkUserUpdate.message;
    }
    res.json(checkUserUpdate);
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: e });
  }
});



router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;