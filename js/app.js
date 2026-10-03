const products = [
  {
    name: "Core Hoodie",
    desc: "Buzo pesado",
    price: 42000,
    mark: "01",
    image: "images/hoodie.jpg"
  },
  {
    name: "Signal Tee",
    desc: "Remera premium",
    price: 24000,
    mark: "02",
    image: "images/tee.jpg"
  },
  {
    name: "District Cargo",
    desc: "Cargo urbano",
    price: 51000,
    mark: "03",
    image: "images/cargo.jpg"
  },
  {
    name: "Mono Cap",
    desc: "Gorra estructurada",
    price: 19000,
    mark: "04",
    image: "images/cap.jpg"
  }
];

let cart = [];

const grid = document.querySelector("#products");
const count = document.querySelector("#cartCount");

const cartBtn = document.querySelector("#cartBtn");
const cartPanel = document.querySelector("#cartPanel");
const cartOverlay = document.querySelector("#cartOverlay");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");

const productModal = document.querySelector("#productModal");
const closeProductModal = document.querySelector("#closeProductModal");
const modalImage = document.querySelector("#modalImage");
const modalName = document.querySelector("#modalName");
const modalDescription = document.querySelector("#modalDescription");
const modalPrice = document.querySelector("#modalPrice");
const modalAdd = document.querySelector("#modalAdd");

let selectedProduct = null;

const money = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(n);

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  count.textContent = totalItems;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p style="color: var(--muted); padding: 20px 0;">
        Tu carrito está vacío.
      </p>
    `;

    cartTotal.textContent = money(0);
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const element = document.createElement("div");

    element.className = "cart-item";

    element.innerHTML = `
      <div class="cart-item-image">${item.mark}</div>

      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${money(item.price)}</p>

        <div class="cart-quantity">
          <button class="minus">−</button>
          <span>${item.quantity}</span>
          <button class="plus">+</button>
        </div>
      </div>

      <button class="cart-remove">Eliminar</button>
    `;

    element.querySelector(".minus").onclick = () => {
      item.quantity--;

      if (item.quantity <= 0) {
        cart.splice(index, 1);
      }

      updateCart();
    };

    element.querySelector(".plus").onclick = () => {
      item.quantity++;
      updateCart();
    };

    element.querySelector(".cart-remove").onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };

    cartItems.appendChild(element);
  });

  cartTotal.textContent = money(total);
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
}

products.forEach((p) => {
  const c = document.createElement("article");

  c.className = "product";
  c.style.cursor = "pointer";

  c.innerHTML = `
    <div class="product-image">
      <img src="${p.image}" alt="${p.name}">
    </div>

    <div class="product-info">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>

      <div class="product-bottom">
        <span>${money(p.price)}</span>
        <button class="add">Agregar</button>
      </div>
    </div>
  `;

  c.onclick = () => {
    selectedProduct = p;

    modalImage.src = p.image;
    modalImage.alt = p.name;
    modalName.textContent = p.name;
    modalDescription.textContent = p.desc;
    modalPrice.textContent = money(p.price);

    productModal.classList.add("open");
  };

  const button = c.querySelector(".add");

  button.onclick = (e) => {
    e.stopPropagation();

    const existing = cart.find((item) => item.name === p.name);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        ...p,
        quantity: 1
      });
    }

    updateCart();

    button.textContent = "✓ Agregado";

    setTimeout(() => {
      button.textContent = "Agregar";
    }, 900);
  };

  grid.appendChild(c);
});

closeProductModal.onclick = (e) => {
  e.stopPropagation();
  productModal.classList.remove("open");
};

productModal.onclick = (e) => {
  if (e.target === productModal) {
    productModal.classList.remove("open");
  }
};

modalAdd.onclick = () => {
  if (!selectedProduct) return;

  const existing = cart.find(
    (item) => item.name === selectedProduct.name
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...selectedProduct,
      quantity: 1
    });
  }

  updateCart();
  productModal.classList.remove("open");
  openCart();
};

cartBtn.onclick = openCart;
closeCart.onclick = closeCartPanel;
cartOverlay.onclick = closeCartPanel;

updateCart();