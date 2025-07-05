module.exports = class UserDto {
    constructor(model) {
      this.id = model.id;
      this.email = model.email;
      this.isActivated = model.isActivated;
      this.name = model.name;
      this.isAdmin = model.isAdmin;
      this.refreshToken = model.refreshToken
    }
  }
