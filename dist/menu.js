const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const prices = [390, 550, 690, 850, 990];
function renderBurger(section, index) {
  const art = section.querySelector('.hero-product');
  {
    const image = new Image(1254, 1254);
    image.className = 'single-burger';
    const isTruffle = section.dataset.type === 'TRUFFLE';
    image.alt = (isTruffle ? 'Truffle' : 'Drool') + ' Smash ' + sizes[index];
    image.src = 'assets/' + (isTruffle ? 'truffle' : 'drool') + '-hq-' + sizes[index].toLowerCase() + '.png';
    art.replaceChildren(image);
    return;
  }
}
document.querySelectorAll('[data-type]').forEach(section => {
  renderBurger(section, 1);
  section.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.size);
    section.querySelectorAll('[data-size]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    section.querySelector('.selection b').textContent = sizes[index];
    section.querySelector('.selection strong').textContent = prices[index] + ' ₺';
    renderBurger(section, index);
  }));
});
