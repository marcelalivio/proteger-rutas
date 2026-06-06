console.log("FUNCIONA");

import { createIntroScene } from "../../../three/intro/introScene";

import { PRODUCTS } from "../../../data/data";

const container = document.getElementById("products")!;
const searchInput = document.getElementById("search") as HTMLInputElement;
const cartCount = document.getElementById("cart-count")!;

// UTILIDADES CARRITO

const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");

const saveCart = (cart: any[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// FAVORITOS

const getFavorites = () =>
  JSON.parse(localStorage.getItem("favorites") || "[]");

const saveFavorites = (fav: number[]) => {
  localStorage.setItem("favorites", JSON.stringify(fav));
};

const isFavorite = (id: number) => {
  const fav = getFavorites();
  return fav.includes(id);
};


const toggleFavorite = (e: Event, id: number) => {
  e.stopPropagation();   // evita que suba el evento
  e.preventDefault();    // evita navegación (🔥 clave)

  let fav = getFavorites();

  if (fav.includes(id)) {
    fav = fav.filter((f: number) => f !== id);
  } else {
    fav.push(id);
  }

  saveFavorites(fav);

  render(PRODUCTS);
};

const showFavorites = () => {
  const favs = getFavorites();

  if (favs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No tenés favoritos ❤️</h2>
        <p>Marcá productos con el corazón</p>
      </div>
    `;
    return;
  }

  const filtered = PRODUCTS.filter(p => favs.includes(p.id));
  render(filtered);
};

//  TOAST

const showToast = (product: any, quantity: number) => {
  const toast = document.createElement("div");
  toast.className = "toast";

  toast.innerHTML = `
    <img src="${product.image}" />
    <div>
      <strong>${product.name}</strong>
      <p>${quantity} x $${product.price}</p>
      <span>¡Agregado al carrito!</span>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};

// CONTADOR GLOBAL

const updateCartCount = () => {
  const cart = getCart();

  const total = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  cartCount.textContent = `(${total})`;
};

// ACTUALIZAR UI ITEM

const updateQtyUI = (id: number) => {
  const cart = getCart();
  const item = cart.find((i: any) => i.id === id);
  const el = document.getElementById(`qty-${id}`);

  if (el) el.textContent = item ? item.quantity : "0";
};

// SUMAR

const increase = (id: number) => {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === id);

  const existing = cart.find((item: any) => item.id === id);

  let quantity = 1;

  if (existing) {
    existing.quantity++;
    quantity = existing.quantity;
  } else if (product) {
    cart.push({ ...product, quantity: 1 });
    quantity = 1;
  }

  saveCart(cart);

  updateQtyUI(id);
  updateCartCount();

  if (product) showToast(product, quantity);
};

// RESTAR

const decrease = (id: number) => {
  let cart = getCart();

  const existing = cart.find((item: any) => item.id === id);

  if (!existing) return;

  existing.quantity--;

  if (existing.quantity <= 0) {
    cart = cart.filter((item: any) => item.id !== id);
  }

  saveCart(cart);

  updateQtyUI(id);
  updateCartCount();
};

// RENDER PRODUCTOS

const render = (products: any[]) => {
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No encontramos resultados 😕</h2>
        <p>Probá con otro nombre de producto</p>
      </div>
    `;
    return;
  }

  products.forEach(p => {
    const isFav = isFavorite(p.id);

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <div class="fav ${isFav ? "active" : ""}" onclick="toggleFavorite(event, ${p.id})">
        ${isFav ? "❤️" : "🤍"}
      </div>

      <img src="${p.image}" />
      <h3>${p.name}</h3>
      <p class="desc">${p.description ?? ""}</p>
      <p class="price">$${p.price}</p>

      <div class="actions">
        <button class="add-btn" onclick="event.stopPropagation(); increase(${p.id})">
          Agregar
        </button>

        <div class="quantity">
          <button onclick="event.stopPropagation(); decrease(${p.id})">-</button>
          <span id="qty-${p.id}">0</span>
          <button onclick="event.stopPropagation(); increase(${p.id})">+</button>
        </div>
      </div>
    `;

    container.appendChild(div);
    updateQtyUI(p.id);
  });
};

// BUSCADOR

searchInput.addEventListener("input", (e: any) => {
  const text = e.target.value.toLowerCase();

  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(text) ||
    p.description?.toLowerCase().includes(text)
  );

  render(filtered);
});

// FILTRO CATEGORÍA

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const filterCategory = (category: string) => {
  if (category === "all") {
    render(PRODUCTS);
    return;
  }

  const filtered = PRODUCTS.filter(
    p => normalize(p.category) === normalize(category)
  );

  render(filtered);
};

// GLOBAL

(window as any).increase = increase;
(window as any).decrease = decrease;
(window as any).filterCategory = filterCategory;
(window as any).toggleFavorite = toggleFavorite;
(window as any).showFavorites = showFavorites;

// =====================
// 🚀 INIT
// =====================

render(PRODUCTS);
updateCartCount();
createIntroScene();