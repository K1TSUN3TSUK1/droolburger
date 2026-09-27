const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const prices = [390, 550, 690, 850, 990];
function renderBurger(section, index) {
  const art = section.querySelector('.hero-product');
  if (section.dataset.type === 'TRUFFLE') {
    const image = new Image(1254, 1254);
    image.className = 'single-burger';
    image.alt = 'Truffle Smash ' + sizes[index];
    image.src = 'assets/truffle-hq-' + sizes[index].toLowerCase() + '.png';
    art.replaceChildren(image);
    return;
  }
  const boxes = [[450,1350,210,310],[415,1030,245,310],[385,697,275,330],[350,368,310,330],[315,8,345,360]];
  const [x,y,w,h] = boxes[index];
  art.innerHTML = '<span class="menu-crop" style="--ratio:'+h+'/'+w+'"><img src="assets/menu-drool-strip.png" alt="Drool Smash '+sizes[index]+'" style="width:'+941/h*100+'%;left:'+(-(1672-y-h)/h*100)+'%;top:'+(-x/w*100)+'%;transform-origin:0 0;transform:rotate(90deg) translateY(-100%)"></span>';
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
