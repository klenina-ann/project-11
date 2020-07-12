class CardList {
  constructor(container, api) {
    this.container = container;
    this.api = api;
  }

  getInitialCards() {
    return this.api.getInitialCards();
  }

  addCard(card) {
    this.container.appendChild(card.create());
  }

  render(cards) {
    cards
      .forEach(card => this.addCard(card));
  }
}