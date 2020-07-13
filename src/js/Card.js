export default class Card {
  constructor(options) {
    Object.assign(this, options);
  }

  // Привязка this для использования в event listener
  like = async (event) => {
    try {
      const {likes} = this.liked ? 
        await this.api.deleteLike(this.id) :
        await this.api.createLike(this.id);
      this.setLikeCount(likes.length);
      this.liked = !this.liked;
      event.target.classList.toggle('place-card__like-icon_liked');
    } catch(e) {
      this.errorNotification.show('Не удалось обновить лайк. ' + e);
    } 
  }

  setLikeCount(count) {
    this
      .cardElement
      .querySelector('.place-card__like-count')
      .textContent = count;
  }

  async saveCard(name, link) {
    const {_id} = await this.api.createCard(name, link);
    this.id = _id;
  }

  // Привязка this для использования в event listener
  remove = async (event) => {
    event.stopPropagation();
    if (!confirm('Вы действительно хотите удалить эту карточку?')) {
      return;
    }
    try {
      await this.api.deleteCard(this.id);
      this.removeEventListeners();
      this.cardElement.remove();
    } catch(e) {
      this.errorNotification.show('Не удалось удалить карточку. ' + e);
    }
    
  }

  // Привязка this для использования в event listener
  open = (event) => {
    this.popup.open(event);
  }

  create() {
    const placeCard = document.createElement('div');
    placeCard.classList.add('place-card');

    const cardImage = document.createElement('div');
    cardImage.classList.add('place-card__image');
    cardImage.style.backgroundImage = `url('${this.link}')`;

    if (this.isOwner) {
      const cardDeleteButton = document.createElement('button');
      cardDeleteButton.classList.add('place-card__delete-icon');
      cardImage.appendChild(cardDeleteButton);
    }

    const cardDescription = document.createElement('div');
    cardDescription.classList.add('place-card__description');

    const cardName = document.createElement('h3');
    cardName.textContent = this.name;
    cardName.classList.add('place-card__name');
    cardDescription.appendChild(cardName);

    const cardLikeContainer = document.createElement('div');
    cardLikeContainer.classList.add('place-card__like-container');

    const cardLike = document.createElement('button');
    cardLike.classList.add('place-card__like-icon');

    if (this.liked) {
      cardLike.classList.add('place-card__like-icon_liked');
    }

    const cardLikeCount = document.createElement('div');
    cardLikeCount.classList.add('place-card__like-count');
    cardLikeCount.textContent = this.likes;

    cardLikeContainer.appendChild(cardLike);
    cardLikeContainer.appendChild(cardLikeCount);
    cardDescription.appendChild(cardLikeContainer);

    placeCard.appendChild(cardImage);
    placeCard.appendChild(cardDescription);

    this.cardElement = placeCard;

    return placeCard;
  }

  setEventListeners(popup) {
    this.popup = popup;

    this
      .cardElement
      .querySelector('.place-card__like-icon')
      .addEventListener('click', this.like);

    this.isOwner && this
      .cardElement
      .querySelector('.place-card__delete-icon')
      .addEventListener('click', this.remove);

    this
      .cardElement
      .querySelector('.place-card__image')
      .addEventListener('click', this.open);
  }

  removeEventListeners() {
    this
      .cardElement
      .querySelector('.place-card__like-icon')
      .removeEventListener('click', this.like);

    this.isOwner && this
      .cardElement
      .querySelector('.place-card__delete-icon')
      .removeEventListener('click', this.remove);

    this
      .cardElement
      .querySelector('.place-card__image')
      .removeEventListener('click', this.open);
  }
}