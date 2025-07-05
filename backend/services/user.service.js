const { user } = require("../models/users");
const uuid = require("uuid");

const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const axios = require("axios");

class UserService {
  async registration(userData) {
    console.log(userData);
    const email = userData.email;
    const candidate = await user.findOne({ email });
    if (candidate) {
      throw new Error(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(userData.password, 3);
    const activationLink = uuid.v4();
    const tokens = tokenService.generateTokens({ ...userData });
    userData.password = hashPassword;
    userData.refreshToken = tokens.refreshToken;
    userData.activationLink = activationLink;

    const newUser = await user.create(userData);
    // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    // await tokenService.saveToken(newUser.id, tokens.refreshToken);

    return { accessToken: tokens.accessToken, user: newUser };
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

    if (!existingUser) {
      const newUser = await user.create({ email, isActivated: true });

      const newUserData = {
        email,
        isActivated: true,
        id: newUser.id,
        isAdmin: newUser.isAdmin,
        name: newUser.name,
      };
      
      const tokens = tokenService.generateTokens(newUserData);
      newUser.refreshToken = tokens.refreshToken;
      await newUser.save();
      return { accessToken: tokens.accessToken, user: newUser };
    }

    const userData = {
      email,
      isActivated: true,
      id: existingUser.id,
      isAdmin: existingUser.isAdmin,
      name: existingUser.name,
    };

    const tokens = tokenService.generateTokens(userData);
    existingUser.refreshToken = tokens.refreshToken;
    await existingUser.save();

    return { accessToken: tokens.accessToken, user: existingUser };
  }

  async activate(activationLink) {
    const usr = await user.findOne({ activationLink });
    console.log(usr);
    if (!usr) {
      throw new Error("Неккоректная ссылка активации");
    }
    if (usr.isActivated) return;
    usr.isActivated = true;
    await usr.save();
  }

  async login(userData) {
    const foundUser = await user.findOne({ email: userData.email });
    if (!foundUser) {
      return "user with this email doesnt exists";
    }
    const isPassEquals = await bcrypt.compare(
      userData.password,
      foundUser.password
    );
    if (!isPassEquals) {
      return "wrong password";
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
      isActivated: foundUser.isActivated,
      name: foundUser.name,
    };

    const tokens = tokenService.generateTokens(payload);
    foundUser.refreshToken = tokens.refreshToken;
    await foundUser.save();
    return { accessToken: tokens.accessToken, user: foundUser };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("Refresh token is missing");

    const userData = tokenService.validateRefreshToken(refreshToken);
    if (!userData) throw new Error("Invalid refresh token");
    console.log(refreshToken)
    const foundUser = await user.findOne({ refreshToken });
    if (!foundUser)
      throw new Error("User not found with provided refresh token");

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      isAdmin: foundUser.isAdmin,
      isActivated: foundUser.isActivated,
      name: foundUser.name,
    };

    const tokens = tokenService.generateTokens(payload);
    foundUser.refreshToken = tokens.refreshToken;
    await foundUser.save();
    return { accessToken: tokens.accessToken, user: foundUser };
  }

  async getAllUsers() {
    // console.log("finding")
    const users = await user.find({});
    return users;
  }

  async findToken(token) {
    const result = await user.find({ refreshToken: token });
    return result[0].refreshToken;
  }

  // async activate(activationLink){
  //     const usr = await user.find({activationLink})
  //     if(!usr)
  //         throw new Error("invalid activation link")
  //     usr.isActivated = true
  //     return await user.updateOne(usr)
  // }
}

module.exports = new UserService();
