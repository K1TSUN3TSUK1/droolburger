(() => {
  // Transcribed from the restaurant's supplied allergen table.
  const commonSauce = ['Gluten', 'Yumurta', 'Balık', 'Süt', 'Kereviz', 'Hardal'];
  const products = {
    'Drool Smash': ['Gluten', 'Yumurta', 'Süt'],
    'Truffle Smash': ['Gluten', 'Yumurta', 'Süt'],
    'Nashville Hot Mozzarella': ['Gluten', 'Yumurta', 'Yer fıstığı', 'Süt'],
    'Crispy Chicken': ['Gluten', 'Yer fıstığı'],
    'Danish Blue': ['Süt'],
    'God Mayo': commonSauce,
    'Sour Ranch': null,
    'Truffle Mayo': commonSauce,
    'Drool Sauce': null,
    'Spicy BBQ': ['Gluten', 'Yumurta', 'Süt', 'Kereviz', 'Hardal'],
    'House Cookie': ['Gluten', 'Yumurta', 'Kabuklu yemiş'],
    'Patates kızartması': ['Yer fıstığı']
  };
  const dialog = document.createElement('dialog');
  dialog.className = 'allergen-dialog';
  dialog.setAttribute('aria-labelledby', 'allergen-title');
  dialog.innerHTML = '<div class="allergen-top"><span>DROOL / İÇİNDE NE VAR?</span><button class="allergen-close" aria-label="Alerjen penceresini kapat">✕</button></div><div class="allergen-body"><p class="allergen-kicker">ÜRÜNÜ TANI.</p><h2 id="allergen-title"></h2><p class="allergen-label">TABLOYA GÖRE İÇERDİĞİ ALERJENLER</p><ul class="allergen-list"></ul><p class="allergen-extra"></p><div class="allergen-note"><b>SİPARİŞTEN ÖNCE</b><p>Alerjen içerikleri üretim süreçleri gereği değişiklik gösterebilir. Ürünlerde çapraz bulaşma riski olabilir. Alerjiniz varsa sipariş vermeden önce ekibimizden bilgi alınız.</p></div><a class="allergen-source" href="assets/allergen-table.png" target="_blank" rel="noopener">Tüm alerjen tablosu </a></div>';
  document.body.append(dialog);
  let opener;
  function open(name, trigger) {
    opener = trigger;
    dialog.querySelector('h2').textContent = name;
    const list = dialog.querySelector('ul');
    list.replaceChildren();
    (products[name] || []).forEach(label => {
      const li = document.createElement('li');
      const mark = document.createElement('span');
      mark.textContent = '!';
      mark.setAttribute('aria-hidden', 'true');
      li.append(mark, document.createTextNode(label));
      list.append(li);
    });
    dialog.querySelector('.allergen-label').textContent = products[name] ? 'TABLOYA GÖRE İÇERDİĞİ ALERJENLER' : 'BU SOS İÇİN EKİBİMİZE DANIŞIN';
    dialog.querySelector('.allergen-extra').textContent = !products[name]
      ? 'Menüdeki sos adı ile alerjen tablosundaki ad farklı. Doğru ürün bilgisini ekibimizden alabilirsiniz.'
      : name.endsWith('Smash') ? 'Burger bilgisi ayrı gösterilmiştir. Yanında gelen patates kızartması: yer fıstığı içerir.' : '';
    dialog.showModal();
    document.body.classList.add('allergen-open');
    dialog.querySelector('.allergen-close').focus();
  }
  dialog.querySelector('.allergen-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('allergen-open'); opener?.focus(); });
  function attach(container, name, id) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'allergen-stamp';
    button.innerHTML = '<svg viewBox="0 0 140 140" aria-hidden="true"><defs><path id="allergen-ring-'+id+'" d="M70,70 m-54,0 a54,54 0 1,1 108,0 a54,54 0 1,1 -108,0"/></defs><text class="stamp-ring"><textPath href="#allergen-ring-'+id+'" textLength="335" lengthAdjust="spacing">ALERJENLER İÇİN TIKLA • DROOL SMASH • </textPath></text><text class="stamp-logo" x="70" y="84" text-anchor="middle" transform="rotate(-18 70 70)">DROOL</text></svg>';
    button.setAttribute('aria-label', name + ' alerjen bilgilerini göster');
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => open(name, button));
    container.append(button);
  }
  document.querySelectorAll('[data-type]').forEach((section,index) => attach(section.querySelector('.burger-art'), section.dataset.type==='TRUFFLE'?'Truffle Smash':'Drool Smash', index));
  function attachProduct(container, name, picture) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'allergen-image-button';
    button.setAttribute('aria-label', name + ' alerjen bilgilerini göster');
    button.setAttribute('aria-haspopup', 'dialog');
    picture.before(button);
    button.append(picture);
    button.addEventListener('click', () => open(name, button));
  }
  document.querySelectorAll('.sides-menu article,.sauce-grid article').forEach(article => {
    const picture = article.querySelector('img');
    attachProduct(article, picture.alt, picture);
  });
  attachProduct(document.querySelector('.fries-note'), 'Patates kızartması', document.querySelector('.fries-note .menu-crop'));
  attachProduct(document.querySelector('.cookie'), 'House Cookie', document.querySelector('.cookie .menu-crop'));
})();
