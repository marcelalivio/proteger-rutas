const container = document.getElementById("cart-items")!;
const totalEl = document.getElementById("total")!;
const subtotalEl = document.getElementById("subtotal")!;
const shippingMsg = document.getElementById("shipping-msg")!;
const checkoutBtn = document.getElementById("checkout-btn")!;

const FREE_SHIPPING = 20000;

// 🔹 Obtener carrito
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");

// 🔹 Guardar carrito
const saveCart = (cart: any) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// 🔹 Sumar
const addToCart = (id: number) => {
  const cart = getCart();
  const item = cart.find((p: any) => p.id === id);

  if (item) item.quantity++;

  saveCart(cart);
  renderCart();
};

// 🔹 Restar
const removeFromCart = (id: number) => {
  let cart = getCart();
  const item = cart.find((p: any) => p.id === id);

  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart = cart.filter((p: any) => p.id !== id);
    }
  }

  saveCart(cart);
  renderCart();
};

// 🔹 Eliminar directo
const deleteItem = (id: number) => {
  let cart = getCart();
  cart = cart.filter((p: any) => p.id !== id);
  saveCart(cart);
  renderCart();
};

// hacer globales
(window as any).addToCart = addToCart;
(window as any).removeFromCart = removeFromCart;
(window as any).deleteItem = deleteItem;

// 🔹 Render
const renderCart = () => {
  const cart = getCart();

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Carrito vacío 🛒</p>";
    subtotalEl.textContent = "";
    totalEl.textContent = "";
    shippingMsg.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((p: any) => {
    total += p.price * p.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="product-info">
        <img src="${p.image}" />

        <div>
          <h3>${p.name}</h3>
          <p>$${p.price.toLocaleString()}</p>
          <button onclick="deleteItem(${p.id})" class="delete-btn">
            Eliminar
          </button>
        </div>
      </div>

      <div class="quantity-controls">
        <button onclick="removeFromCart(${p.id})">−</button>
        <span>${p.quantity}</span>
        <button onclick="addToCart(${p.id})">+</button>
      </div>
    `;

    container.appendChild(div);
  });

  // Totales
  subtotalEl.textContent = "Productos: $" + total.toLocaleString();
  totalEl.textContent = "Total: $" + total.toLocaleString();

  // Envío gratis
  if (total >= FREE_SHIPPING) {
    shippingMsg.textContent = "🚚 Tenés envío gratis";
  } else {
    const remaining = FREE_SHIPPING - total;
    shippingMsg.textContent = `Agregá $${remaining.toLocaleString()} para tener envío gratis`;
  }
};

// 🔹 Checkout
checkoutBtn.onclick = () => {
  alert("Compra finalizada 🎉");
  localStorage.removeItem("cart");
  renderCart();
};

// 🔹 Init
renderCart();