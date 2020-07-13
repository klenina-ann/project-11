export default class Popup {
  constructor(container, contents, hooks) {
    this.container = container;
    this.contents = contents;
    this.openHook = hooks.openHook.bind(this);
    this.closeHook = hooks.closeHook.bind(this);
    this.isLoading = false;
    this.button = this.contents.querySelector('button');
    this.initialButtonText = this.button && this.button.textContent;
  }

  open(event) {
    this.openHook(event);
    this.container.appendChild(this.contents);
    this.container.classList.add('popup_is-opened');
  }

  // Привязка this для использования в event listener
  close = (event) => {
    this.closeHook(event);
    this.container.classList.remove('popup_is-opened');
    this.container.removeChild(this.contents);
  }

  startLoading() {
    this.isLoading = true;
    if (this.button) {
      this.button.classList.add('popup__button_loading');
      this.button.textContent = 'Загрузка...';
    }
  }

  finishLoading() {
    this.isLoading = false;
    if (this.button) {
      this.button.textContent = this.initialButtonText;
      this.button.classList.remove('popup__button_loading');
    }
  }

  setEventListeners() {
    this
      .contents
      .querySelector('.popup__close')
      .addEventListener('click', this.close);
  }
}