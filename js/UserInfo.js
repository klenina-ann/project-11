class UserInfo {
  constructor(options) {
   Object.assign(this, options);
   const name = userNameElement.innerText;
   const job = userJobElement.innerText;
   this.setUserInfo(name, job);
  }

  setUserInfo(name, job, id) {
  	this.name = name;
  	this.job = job;
    if (id) {
      this.id = id;
    }
  }

  getProfile() {
    return this.api.getProfile();
  }

  setAvatar(avatar) {
    this.avatar = avatar;
  }

  updateAvatar(avatar) {
    this.userAvatarElement.style.backgroundImage = `url(${avatar})`;
  }

  saveProfile(name, about) {
    return this.api.updateProfile(name, about);
  }

  saveAvatar(avatar) {
    return this.api.updateAvatar(avatar);
  }

  updateUserInfo(name, job) {
  	this.userNameElement.innerText = name;
  	this.userJobElement.innerText = job;
  }
}