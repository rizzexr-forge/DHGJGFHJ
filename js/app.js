// ===================== DATA =====================
const categories = [
  { name: 'Собаки', icon: '🐕', count: 1240, filter: 'dogs' },
  { name: 'Кошки', icon: '🐈', count: 980, filter: 'cats' },
  { name: 'Птицы', icon: '🦜', count: 320, filter: 'birds' },
  { name: 'Рыбы', icon: '🐠', count: 410, filter: 'fish' },
  { name: 'Грызуны', icon: '🐹', count: 280, filter: 'rodents' },
  { name: 'Рептилии', icon: '🐢', count: 150, filter: 'reptiles' },
];

const products = [
  { id:1, name:'Корм Royal Canin для собак средних пород', category:'dogs', price:2890, oldPrice:3200, emoji:'🐕', badge:'sale', rating:4.9, reviews:324 },
  { id:2, name:'Корм Pro Plan для кошек Sterilised', category:'cats', price:2150, oldPrice:null, emoji:'🐈', badge:'new', rating:4.8, reviews:256 },
  { id:3, name:'Интерактивная игрушка для собак', category:'dogs', price:890, oldPrice:1200, emoji:'🧸', badge:'sale', rating:4.7, reviews:189 },
  { id:4, name:'Наполнитель Catsan Premium 20л', category:'cats', price:650, oldPrice:null, emoji:'🧱', badge:null, rating:4.6, reviews:412 },
  { id:5, name:'Корм для попугаев Vitakraft', category:'birds', price:420, oldPrice:null, emoji:'🦜', badge:null, rating:4.5, reviews:98 },
  { id:6, name:'Аквариумный фильтр Eheim', category:'fish', price:3200, oldPrice:3800, emoji:'🐠', badge:'sale', rating:4.9, reviews:167 },
  { id:7, name:'Клетка для хомяков Ferplast', category:'rodents', price:2100, oldPrice:null, emoji:'🐹', badge:'new', rating:4.4, reviews:87 },
  { id:8, name:'Лакомство Pedigree Dentastix', category:'dogs', price:390, oldPrice:450, emoji:'🦴', badge:'sale', rating:4.8, reviews:543 },
  { id:9, name:'Когтеточка для кошек 180см', category:'cats', price:4500, oldPrice:5200, emoji:'🪵', badge:'sale', rating:4.9, reviews:201 },
  { id:10, name:'Корм для рыб TetraMin', category:'fish', price:380, oldPrice:null, emoji:'🐟', badge:null, rating:4.3, reviews:312 },
  { id:11, name:'Шампунь для собак 8in1', category:'dogs', price:520, oldPrice:null, emoji:'🧴', badge:'new', rating:4.6, reviews:145 },
  { id:12, name:'Домик для кошек с лежанкой', category:'cats', price:3800, oldPrice:4100, emoji:'🏠', badge:'sale', rating:4.7, reviews:178 },
  { id:13, name:'Корм для канареек Padovan', category:'birds', price:290, oldPrice:null, emoji:'🐤', badge:null, rating:4.4, reviews:76 },
  { id:14, name:'Клетка для попугаев Север-Юг', category:'birds', price:6500, oldPrice:7200, emoji:'🏡', badge:'sale', rating:4.8, reviews:54 },
  { id:15, name:'Одейло для собак ортопедическое', category:'dogs', price:2200, oldPrice:null, emoji:'🛏️', badge:'new', rating:4.7, reviews:132 },
  { id:16, name:'Набор мисок для кошек', category:'cats', price:780, oldPrice:900, emoji:'🍽️', badge:'sale', rating:4.5, reviews:209 },
  { id:17, name:'Корм для крыс Versele-Laga', category:'rodents', price:560, oldPrice:null, emoji:'🐀', badge:null, rating:4.3, reviews:43 },
  { id:18, name:'Игровой тоннель для кошек', category:'cats', price:1350, oldPrice:1600, emoji:'🎪', badge:'sale', rating:4.6, reviews:167 },
  { id:19, name:'GPS-ошейник для собак', category:'dogs', price:5900, oldPrice:6500, emoji:'📡', badge:'new', rating:4.9, reviews:89 },
  { id:20, name:'Светильник для террариума', category:'reptiles', price:1800, oldPrice:null, emoji:'💡', badge:null, rating:4.5, reviews:34 },
];

// ===================== STATE =====================
let cart = [];
let wishlist = [];
let currentFilter = 'all';
let visibleCount = 8;

// ===================== DOM =====================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  initHeader();
  initSearch();
  initFilters();
  initCart();
  initForms();
  initScrollAnimations();
});

// ===================== CATEGORIES =====================
function renderCategories() {
  const grid = $('#categoriesGrid');
  grid.innerHTML = categories.map(c => `
    <div class="category-card" data-filter="${c.filter}">
      <span class="category-card__icon">${c.icon}</span>
      <div class="category-card__name">${c.name}</div>
      <div class="category-card__count">${c.count} товаров</div>
    </div>
  `).join('');

  $$('.category-card', grid).forEach(card => {
    card.addEventListener('click', () => {
      currentFilter = card.dataset.filter;
      visibleCount = 8;
      updateFilterButtons();
      renderProducts();
      $('#popular').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ===================== PRODUCTS =====================
function getFilteredProducts() {
  const filtered = currentFilter === 'all'
    ? products
    : products.filter(p => p.category === currentFilter);
  return filtered;
}

function renderProducts() {
  const grid = $('#productsGrid');
  const filtered = getFilteredProducts();
  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = toShow.map(p => {
    const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= .5 ? '½' : '');
    const isWished = wishlist.includes(p.id);
    return `
    <div class="product-card" data-id="${p.id}">
      ${p.badge ? `<span class="product-card__badge product-card__badge--${p.badge}">${p.badge === 'sale' ? 'Скидка' : 'Новинка'}</span>` : ''}
      <button class="product-card__wishlist ${isWished ? 'active' : ''}" data-id="${p.id}" aria-label="В избранное">
        ${isWished ? '❤️' : '🤍'}
      </button>
      <div class="product-card__image">${p.emoji}</div>
      <div class="product-card__body">
        <div class="product-card__category">${getCategoryName(p.category)}</div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__rating">
          <span class="stars">${stars}</span>
          <span class="count">(${p.reviews})</span>
        </div>
        <div class="product-card__footer">
          <div class="product-card__price">
            <span class="current">${p.price.toLocaleString('ru-RU')} ₽</span>
            ${p.oldPrice ? `<span class="old">${p.oldPrice.toLocaleString('ru-RU')} ₽</span>` : ''}
          </div>
          <button class="product-card__add" data-id="${p.id}" aria-label="В корзину">+</button>
        </div>
      </div>
    </div>
    `;
  }).join('');

  const loadMoreBtn = $('#loadMore');
  if (filtered.length <= visibleCount) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = '';
  }

  // Bind events
  $$('.product-card__add', grid).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.id));
    });
  });

  $$('.product-card__wishlist', grid).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleWishlist(parseInt(btn.dataset.id), btn);
    });
  });
}

function getCategoryName(cat) {
  const map = { dogs: 'Собаки', cats: 'Кошки', birds: 'Птицы', fish: 'Рыбы', rodents: 'Грызуны', reptiles: 'Рептилии' };
  return map[cat] || cat;
}

function initFilters() {
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      visibleCount = 8;
      updateFilterButtons();
      renderProducts();
    });
  });

  $('#loadMore').addEventListener('click', () => {
    visibleCount += 8;
    renderProducts();
  });
}

function updateFilterButtons() {
  $$('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

// ===================== HEADER =====================
function initHeader() {
  const header = $('#header');
  const burger = $('#burger');
  const nav = $('#nav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  $$('.nav__link', nav).forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// ===================== SEARCH =====================
function initSearch() {
  const overlay = $('#searchOverlay');
  const input = $('#searchInput');
  const results = $('#searchResults');

  $('.search-toggle').addEventListener('click', () => {
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) {
      setTimeout(() => input.focus(), 300);
    }
  });

  $('#searchClose').addEventListener('click', () => {
    overlay.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
  });

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ''; return; }

    const found = products.filter(p =>
      p.name.toLowerCase().includes(q) || getCategoryName(p.category).toLowerCase().includes(q)
    );

    results.innerHTML = found.length ? found.map(p => `
      <div class="search-result" data-id="${p.id}">
        <span class="search-result__emoji">${p.emoji}</span>
        <div class="search-result__info">
          <div class="search-result__name">${p.name}</div>
        </div>
        <span class="search-result__price">${p.price.toLocaleString('ru-RU')} ₽</span>
      </div>
    `).join('') : '<p style="padding:16px;color:var(--gray);text-align:center">Ничего не найдено</p>';

    $$('.search-result', results).forEach(el => {
      el.addEventListener('click', () => {
        addToCart(parseInt(el.dataset.id));
        overlay.classList.remove('open');
        input.value = '';
        results.innerHTML = '';
      });
    });
  });
}

// ===================== CART =====================
function initCart() {
  const sidebar = $('#cartSidebar');
  const overlay = $('#cartOverlay');

  $('#cartToggle').addEventListener('click', () => openCart());
  $('#cartClose').addEventListener('click', () => closeCart());
  overlay.addEventListener('click', () => closeCart());
}

function openCart() {
  $('#cartSidebar').classList.add('open');
  $('#cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  $('#cartSidebar').classList.remove('open');
  $('#cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`${product.name.split(' ').slice(0,3).join(' ')} добавлен в корзину`);
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartUI();
}

function updateCartUI() {
  const itemsEl = $('#cartItems');
  const footerEl = $('#cartFooter');
  const countEl = $('#cartCount');
  const totalEl = $('#cartTotal');

  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  countEl.textContent = totalItems;
  countEl.classList.toggle('show', totalItems > 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty__icon">🛒</span>
        <p>Корзина пуста</p>
        <span>Добавьте товары из каталога</span>
      </div>
    `;
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = '';
  totalEl.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';

  itemsEl.innerHTML = cart.map(c => `
    <div class="cart-item">
      <span class="cart-item__emoji">${c.emoji}</span>
      <div class="cart-item__info">
        <div class="cart-item__name">${c.name}</div>
        <div class="cart-item__price">${(c.price * c.qty).toLocaleString('ru-RU')} ₽</div>
        <div class="cart-item__controls">
          <button class="cart-item__qty-btn" data-id="${c.id}" data-action="minus">−</button>
          <span class="cart-item__qty">${c.qty}</span>
          <button class="cart-item__qty-btn" data-id="${c.id}" data-action="plus">+</button>
          <button class="cart-item__remove" data-id="${c.id}">✕</button>
        </div>
      </div>
    </div>
  `).join('');

  $$('.cart-item__qty-btn', itemsEl).forEach(btn => {
    btn.addEventListener('click', () => {
      changeQty(parseInt(btn.dataset.id), btn.dataset.action === 'plus' ? 1 : -1);
    });
  });

  $$('.cart-item__remove', itemsEl).forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
  });
}

// ===================== WISHLIST =====================
function toggleWishlist(productId, btn) {
  const idx = wishlist.indexOf(productId);
  if (idx === -1) {
    wishlist.push(productId);
    btn.classList.add('active');
    btn.innerHTML = '❤️';
    showToast('Добавлено в избранное');
  } else {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '🤍';
  }
}

// ===================== FORMS =====================
function initForms() {
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    showToast('Сообщение отправлено! Мы свяжемся с вами.');
    e.target.reset();
  });

  $('#newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    showToast('Вы подписались на рассылку!');
    e.target.reset();
  });
}

// ===================== TOAST =====================
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===================== SCROLL ANIMATIONS =====================
function initScrollAnimations() {
  const elements = $$('.category-card, .product-card, .delivery__step, .testimonial, .feature');
  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}
