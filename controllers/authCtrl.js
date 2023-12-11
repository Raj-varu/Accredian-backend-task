const db = require("../config/db");
const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
// Registration Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    //exisiting user
    const [user] = await await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // If a user is found, return the data
    if (user.length > 0) {
      return res.status(200).send({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    const hashedAnswer = await hashPassword(answer);
    //save
    await db.execute(
      "INSERT INTO users (email, password, name, answer) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, name, hashedAnswer]
    );

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};
//Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // If a user is found, return the data
    if (!(user.length > 0)) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }

    const match = await comparePassword(password, user[0].password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    //i am used to work with mongodb so i use _id as payload but i have no idea about sql so email😊
    //or else have to create seperate function which will generate random id and then check if its not same in db and then assign to new user idk
    const token = await JWT.sign(
      { email: user[0].email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user[0].name,
        email: user[0].email,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController

const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check user
    const [findUser] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // If a user is found, return the data
    if (!(findUser.length > 0)) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }

    const match = await comparePassword(answer, findUser[0].answer);
    // const [user] = await db.execute(
    //   "SELECT * FROM users WHERE email = ? AND answer = ?",
    //   [email, answer]
    // );

    // validation
    // if (!(user.length > 0)) {
    //   return res.status(200).send({
    //     success: false,
    //     message: "Wrong Email Or Answer",
    //   });
    // }
    if (match) {
      //Hasing new password
      const hashed = await hashPassword(newPassword);
      await db.execute("UPDATE users SET password = ? WHERE email = ?", [
        hashed,
        email,
      ]);
      res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

module.exports = {
  loginController,
  registerController,
  forgotPasswordController,
};
