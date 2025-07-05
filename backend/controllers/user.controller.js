const userService = require("../services/user.service");
const { user } = require("../models/users");
const tokenService = require("../services/token.service");
const mailService = require("../services/mail.service");
const UserDTO = require("../dtos/user.dto");
const axios = require("axios");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const secure = true;

class UserController {
  async registration(req, res, next) {
    try {
      const userData = await userService.registration(req.body);
      const templatePath = path.join(__dirname, "../utils/email-template.html");
      if (!fs.existsSync(templatePath)) {
          console.error("Email template not found:", templatePath);
          return res.status(500).json({ message: "Email template missing" });
      }
      const source = fs.readFileSync(templatePath, "utf-8").toString();
      const template = handlebars.compile(source);
      const replacements = {
        username: userData.user.email,
        message: `
            <p>In order to verify that you are not a robot but a real user, please confirm your email. 
            Account activation will also unlock opportunities for auction bidding.</p>
            <a target="_blank" href='${process.env.SERVER_URL}/api/users/activate/${userData.user.activationLink}' class="button">Activate</a>
        `,
      };

      const htmlToSend = template(replacements);

      mailService.sendMail(
        '"BuyBitArt.com" <info@buybitart.com>',
        userData.user.email,
        "Account activation on buybitart.com",
        "Account Activation",
        htmlToSend
      );
      res.cookie("refreshToken", userData.user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure,
        sameSite: 'None'
      });
      const userDTO = new UserDTO(userData.user);
      return res.json({ accessToken: userData.accessToken, user: userDTO });
    } catch (e) {
      console.log(e);
      // next(e);
    }
  }

  async login(req, res, next) {
    try {
      const userData = await userService.login(req.body);
      if (typeof userData === "string") return res.json(userData);
      res.cookie("refreshToken", userData.user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure,
        sameSite: 'None'
      });
      const userDTO = new UserDTO(userData.user);
      return res.json({ accessToken: userData.accessToken, user: userDTO });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json("updated");
    } catch (e) {
      next(e);
    }
  }

  async registerGoogleUser(req, res, next) {
    const userData = await userService.registerGoogleUser();
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      console.log(activationLink);
      await userService.activate(activationLink);
      return res.redirect(
        `${process.env.CLIENT_URL}?${new URLSearchParams({ activated: true })}`
      );
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.user.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure,
        sameSite: 'None'
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async googleAuth(req, res, next) {
    try {
      if (req.body.googleAccessToken) {
        const { googleAccessToken } = req.body;
        const userData = await userService.googleSign(googleAccessToken);

        if (userData)
          res.cookie("refreshToken", userData.user.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure,
            sameSite: 'None'
          });
        return res.json(userData);
      }
    } catch (e) {
      next(e);
    }
  }

  async googleSign(googleAccessToken) {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      }
    );

    const email = response.data.email;
    const existingUser = await user.findOne({ email });

    const userData = {
      email,
      isActivated: true,
    };

    const tokens = tokenService.generateTokens({ ...userData });

    userData.refreshToken = tokens.refreshToken;

    if (!existingUser) {
      const newUser = await user.create(userData);
      return { accessToken: tokens.accessToken, user: newUser };
    }

    existingUser.refreshToken = tokens.refreshToken;
    await existingUser.save();

    return { accessToken: tokens.accessToken, user: existingUser };
  }

  async getOneUser(req, res, next) {
    try {
      const foundUser = await user.findById(req.params.id);
      res.status(200).json(foundUser);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
