export default class FormValidator {
  constructor(form) {
    this.form = form;
    this.inputs = form.querySelectorAll('input');
    this.submitButton = form.querySelector('button');
  }

  clearErrors() {
    Array
      .from(this.form.querySelectorAll('.popup__error_visible'))
      .forEach(el => {
        el.classList.remove('popup__error_visible');
      });
  }

  getErrorText(validity) {
    if (validity.valueMissing) {
      return 'Это обязательное поле';
    }

    if (validity.typeMismatch) {
      return 'Здесь должна быть ссылка';
    }

    if (validity.patternMismatch) {
      return 'Должно быть от 2 до 30 символов';
    }

    return '';
  }

  checkInputValidity(inputEl, errorEl) {
    const validity = inputEl.validity;
    if (validity.valid) {
      errorEl.classList.remove('popup__error_visible');
      errorEl.innerText = '';
      return;
    }

    const errorText = this.getErrorText(validity);

    errorEl.innerText = errorText;
    errorEl.classList.add('popup__error_visible');
  }

  setSubmitButtonState() {
    const allValid = Array
      .from(this.inputs)
      .every(i => i.validity.valid);

    if (allValid) {
      this.submitButton.classList.add('popup__button_active');
      this.submitButton.disabled = false;
    } else {
      this.submitButton.classList.remove('popup__button_active');
      this.submitButton.disabled = true;
    }
  }

  setEventListeners() {
    Array.from(this.inputs).forEach(i => {
      const inputEl = i;
      const errorEl = inputEl.nextElementSibling;
      inputEl.addEventListener('input', e => {
        this.checkInputValidity(inputEl, errorEl);
        this.setSubmitButtonState();
      });
    });
  }
}