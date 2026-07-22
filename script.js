const STORAGE_KEY = 'luxo_aureo_produtos';
const CONTACT_BASE = 'https://wa.me/5500000000000?text=';

const initialProducts = [
  {
    id: crypto.randomUUID(),
    name: 'Colar Aurora Dourado',
    price: 189.9,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    description: 'Colar com design elegante, brilho sutil e acabamento refinado para compor looks sofisticados em qualquer ocasião.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Anel Imperial Cristal',
    price: 149.9,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca5?auto=format&fit=crop&w=900&q=80',
    description: 'Anel com banho dourado e aplicação delicada de cristal, ideal para quem busca presença com elegância.'
  },
  {
    id: crypto.randomUUID(),
    name: 'Bracelete Essenza Lux',
    price: 219.9,
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
    description: 'Bracelete robusto, contemporâneo e sofisticado, com visual marcante para elevar a produção.'
  }
];

const productGrid = document.getElementById('productGrid');
const highlightGrid = document.getElementById('highlightGrid');
const productForm = document.getElementById('productForm');
const searchInput = document.getElementById('searchInput');
const catalogStats = document.getElementById('catalogStats');
const resetProductsButton = document.getElementById('resetProducts');
const currentYear = document.getElementById('currentYear');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

const modal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const modalContactBtn = document.getElementById('modalContactBtn');

let products = loadProducts();
let currentFilter = '';

function loadProducts() {
  const savedProducts = localStorage.getItem(STORAGE_KEY);
  if (!savedProducts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return [...initialProducts];
  }

  try {
    return JSON.parse(savedProducts);
  } catch (error) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    return [...initialProducts];
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

function buildContactLink(productName) {
  const message = encodeURIComponent(`Olá! Tenho interesse na peça ${productName}. Gostaria de mais informações e condições de compra.`);
  return `${CONTACT_BASE}${message}`;
}

function renderHighlights() {
  const featured = products.slice(0, 3);
  highlightGrid.innerHTML = featured.map(product => `
    <article class="product-card" tabindex="0" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-card-content">
        <span class="product-meta">Destaque</span>
        <div class="product-title-row">
          <h3 class="product-title">${product.name}</h3>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-actions">
          <button class="btn btn-secondary open-details" data-id="${product.id}">Ver detalhes</button>
          <a class="btn btn-primary product-action-link" href="${buildContactLink(product.name)}" target="_blank" rel="noopener noreferrer">Solicitar compra</a>
        </div>
      </div>
    </article>
  `).join('');
}

function getFilteredProducts() {
  const term = currentFilter.trim().toLowerCase();
  if (!term) return products;

  return products.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term)
  );
}

function renderProducts() {
  const filtered = getFilteredProducts();

  if (!filtered.length) {
    productGrid.innerHTML = `
      <div class="empty-state">
        <h3>Nenhum produto encontrado</h3>
        <p>Tente outro termo de busca ou cadastre uma nova semi-joia.</p>
      </div>
    `;
  } else {
    productGrid.innerHTML = filtered.map(product => `
      <article class="product-card" tabindex="0" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-card-content">
          <span class="product-meta">Semi-joia exclusiva</span>
          <div class="product-title-row">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-price">${formatPrice(product.price)}</span>
          </div>
          <p class="product-description">${product.description}</p>
          <div class="product-actions">
            <button class="btn btn-secondary open-details" data-id="${product.id}">Ver melhor</button>
            <a class="btn btn-primary product-action-link" href="${buildContactLink(product.name)}" target="_blank" rel="noopener noreferrer">Entrar em contato</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  const count = filtered.length;
  catalogStats.textContent = `${count} produto${count === 1 ? '' : 's'} ${currentFilter ? 'encontrado' + (count === 1 ? '' : 's') : 'cadastrado' + (count === 1 ? '' : 's')}`;
}

function renderAll() {
  renderHighlights();
  renderProducts();
}

function openProductModal(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalPrice.textContent = formatPrice(product.price);
  modalDescription.textContent = product.description;
  modalContactBtn.href = buildContactLink(product.name);

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function handleProductForm(event) {
  event.preventDefault();

  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const image = document.getElementById('productImage').value.trim();
  const description = document.getElementById('productDescription').value.trim();

  if (!name || !image || !description || Number.isNaN(price)) return;

  const newProduct = {
    id: crypto.randomUUID(),
    name,
    price,
    image,
    description
  };

  products.unshift(newProduct);
  saveProducts();
  productForm.reset();
  currentFilter = '';
  searchInput.value = '';
  renderAll();

  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

function restoreInitialProducts() {
  products = [...initialProducts];
  saveProducts();
  currentFilter = '';
  searchInput.value = '';
  renderAll();
}

function handleProductGridClick(event) {
  const detailsButton = event.target.closest('.open-details');
  if (detailsButton) {
    event.stopPropagation();
    openProductModal(detailsButton.dataset.id);
    return;
  }

  const card = event.target.closest('.product-card');
  if (card && !event.target.closest('.product-action-link')) {
    openProductModal(card.dataset.id);
  }
}

function handleKeyboardCardOpen(event) {
  const card = event.target.closest('.product-card');
  if (!card) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openProductModal(card.dataset.id);
  }
}

function setupRevealAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

function setupEvents() {
  productForm.addEventListener('submit', handleProductForm);
  searchInput.addEventListener('input', (event) => {
    currentFilter = event.target.value;
    renderProducts();
  });

  resetProductsButton.addEventListener('click', restoreInitialProducts);
  productGrid.addEventListener('click', handleProductGridClick);
  highlightGrid.addEventListener('click', handleProductGridClick);
  productGrid.addEventListener('keydown', handleKeyboardCardOpen);
  highlightGrid.addEventListener('keydown', handleKeyboardCardOpen);
  modalOverlay.addEventListener('click', closeProductModal);
  modalClose.addEventListener('click', closeProductModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeProductModal();
    }
  });

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

function init() {
  currentYear.textContent = new Date().getFullYear();
  renderAll();
  setupEvents();
  setupRevealAnimation();
}

init();
