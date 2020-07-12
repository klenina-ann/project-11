import './pages/index.css';
import Card from './js/Card.js';
import CardList from './js/CardList.js';
import FormValidator from './js/FormValidator.js';
import Popup from './js/Popup.js';
import UserInfo from './js/UserInfo.js';
import Api from './js/Api.js';
import ErrorNotification from './js/ErrorNotification.js';

const addButton = document.querySelector('.user-info__button_add');
const editButton = document.querySelector('.user-info__button_edit');
const userNameElement = document.querySelector('.user-info__name');
const userJobElement = document.querySelector('.user-info__job');
const userAvatarElement = document.querySelector('.user-info__photo');
const popupContainer = document.querySelector('.popup');
const placesList = document.querySelector('.places-list');

const api = new Api({
  baseUrl: 'https://praktikum.tk/cohort10',
  headers: {
    authorization: 'a2069ab8-980b-4f2c-8341-7534f07e2496',
    'Content-Type': 'application/json'
  }
});

const errorNotification = new ErrorNotification('.error-notification', 'error-notification_active');

const userInfo = new UserInfo({userNameElement, userJobElement, userAvatarElement, api});

const addCardPopupContents = templateToElement('#add-card-template');
const editProfilePopupContents = templateToElement('#edit-profile-template');
const editAvatarPopupContents = templateToElement('#edit-avatar-template');
const placePopupContents = templateToElement('#place-template');

const cardForm = addCardPopupContents.querySelector('form');
const profileForm = editProfilePopupContents.querySelector('form');
const avatarForm = editAvatarPopupContents.querySelector('form');

const cardFormValidator = new FormValidator(cardForm);
const profileFormValidator = new FormValidator(profileForm);
const avatarFormValidator = new FormValidator(avatarForm);

const cardList = new CardList(placesList, api);

const addCardPopupHooks = {
  openHook: () => {
    cardFormValidator.setSubmitButtonState();
  },
  closeHook: () => {
    cardForm.reset();
    cardFormValidator.clearErrors();
  }
};

const editProfilePopupHooks = {
  openHook: () => {
    const { name, job } = profileForm.elements;
    name.value = userInfo.name;
    job.value = userInfo.job;
    profileFormValidator.setSubmitButtonState();
  },
  closeHook: () => {
    profileForm.reset();
    profileFormValidator.clearErrors();
  }
};

const editAvatarPopupHooks = {
  openHook: () => {
    avatarFormValidator.setSubmitButtonState();
  },
  closeHook: () => {
    avatarForm.reset();
    avatarFormValidator.clearErrors();
  }
};

const placePopupHooks = {
  openHook: function (event) {
    const src = event.target.style.backgroundImage.slice(4, -1).replace(/'|"/g, '');
    this.contents.querySelector('.popup__image').src = src;
  },
  closeHook: function () {
    this.contents.querySelector('.popup__image').src = '';
  }
};

const addCardPopup = new Popup(popupContainer, addCardPopupContents, addCardPopupHooks);
const editProfilePopup = new Popup(popupContainer, editProfilePopupContents, editProfilePopupHooks);
const placePopup = new Popup(popupContainer, placePopupContents, placePopupHooks);
const editAvatarPopup = new Popup(popupContainer, editAvatarPopupContents, editAvatarPopupHooks);

function templateToElement(selector) {
  const html = document.querySelector(selector).innerHTML.trim();
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}

async function submitCardForm(event) {
  event.preventDefault();
  if (addCardPopup.isLoading) {
    return;
  }
  const { name, link } = cardForm.elements;
  try {
    const card = new Card({
      name: name.value,
      link: link.value,
      likes: 0,
      isOwner: true,
      liked: false,
      api,
      errorNotification
    });
    addCardPopup.startLoading();
    await card.saveCard(name.value, link.value);
    addCardPopup.finishLoading();
    cardList.addCard(card);
    card.setEventListeners(placePopup);
    addCardPopup.close();
  } catch(e) {
    addCardPopup.finishLoading();
    errorNotification.show('Не удалось сохранить карточку. ' + e);
  }
}

async function submitProfileForm(event) {
  event.preventDefault();
  if (editProfilePopup.isLoading) {
    return;
  }
  const { name, job } = profileForm.elements;
  try {
    editProfilePopup.startLoading();
    await userInfo.saveProfile(name.value, job.value);
    editProfilePopup.finishLoading();
    userInfo.setUserInfo(name.value, job.value);
    userInfo.updateUserInfo(name.value, job.value);
    editProfilePopup.close();
  } catch(e) {
    editProfilePopup.finishLoading();
    errorNotification.show('Не удалось обновить профиль. ' + e);
  }
}

async function submitAvatarForm(event) {
  event.preventDefault();
  if (editAvatarPopup.isLoading) {
    return;
  }
  const { avatar } = avatarForm.elements;
  try {
    editAvatarPopup.startLoading();
    await userInfo.saveAvatar(avatar.value);
    editAvatarPopup.finishLoading();
    userInfo.setAvatar(avatar.value);
    userInfo.updateAvatar(avatar.value);
    editAvatarPopup.close();
  } catch(e) {
    editAvatarPopup.finishLoading();
    errorNotification.show('Не удалось обновить аватар. ' + e);
  }
}

async function main () {
  // Загрузка профиля
  try {
    const {name, about, avatar, _id: id} = await userInfo.getProfile();
    userInfo.setUserInfo(name, about, id);
    userInfo.updateUserInfo(name, about);
    userInfo.setAvatar(avatar);
    userInfo.updateAvatar(avatar);
  } catch(e) {
    errorNotification.show('Не удалось загрузить профиль. ' + e);
  }

  // Загрузка карточек
  try {
    const cardsConfig = await cardList.getInitialCards();

    const initialCards = cardsConfig
      .map(({ name, link, likes, owner, _id }) => 
        new Card({
          name,
          link, 
          likes: likes.length,
          isOwner: owner._id === userInfo.id,
          liked: likes.map(obj => obj._id).includes(userInfo.id),
          id: _id,
          api,
          errorNotification
        })
      );

    cardList.render(initialCards);
    initialCards.forEach(card => card.setEventListeners(placePopup));
  } catch(e) {
    errorNotification.show('Не удалось загрузить карточки. ' + e);
  }
}

cardFormValidator.setEventListeners();
profileFormValidator.setEventListeners();
avatarFormValidator.setEventListeners();

addCardPopup.setEventListeners();
editProfilePopup.setEventListeners();
editAvatarPopup.setEventListeners();
placePopup.setEventListeners();

cardForm.addEventListener('submit', submitCardForm);
profileForm.addEventListener('submit', submitProfileForm);
avatarForm.addEventListener('submit', submitAvatarForm);
addButton.addEventListener('click', () => addCardPopup.open());
editButton.addEventListener('click', () => editProfilePopup.open());
userAvatarElement.addEventListener('click', () => editAvatarPopup.open());

main();