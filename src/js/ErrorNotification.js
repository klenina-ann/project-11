export default class ErrorNotification {
  constructor(selector, activeClass) {
    this.activeClass = activeClass;
    this.element = document.querySelector(selector);
    this.setEventListener();
  }

  show(message) {
    console.log('ErrorNotification:', message);
    if (!this.element) {
      return;
    }
    this.element.textContent = message;
    this.element.classList.add(this.activeClass);
    setTimeout(this.hide, 3000);
  }

  // Привязка this для использования в event listener
  hide = () => {
    if (!this.element) {
      return;
    }
    this.element.classList.remove(this.activeClass);
  }

  setEventListener() {
    if (!this.element) {
      return;
    }
    this.element.addEventListener('click', this.hide)
  }
}