// TASK 1: Define JavaScript array of product objects (8 products)[cite: 1]
const products = [
    { id: 1, name: "Headphones", price: 2499, image: "🎧" },
    { id: 2, name: "Smart Watch", price: 3999, image: "⌚" },
    { id: 3, name: "Bluetooth Speaker", price: 1999, image: "🔊" },
    { id: 4, name: "Keyboard", price: 3499, image: "⌨️" },
    { id: 5, name: "Gaming Mouse", price: 1499, image: "🖱️" },
    { id: 6, name: "USB Charger", price: 999, image: "🔌" },
    { id: 7, name: "Laptop Stand", price: 1299, image: "💻" },
    { id: 8, name: "Webcam", price: 2299, image: "📷" }
];

// Helper functions for localStorage persistence[cite: 1]
function getCart() {
    return JSON.parse(localStorage.getItem("shopease_cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("shopease_cart", JSON.stringify(cart));
    updateCartBadge();
}

// TASK 8: Update navbar cart item count badge from localStorage[cite: 1]
function updateCartBadge() {
    const badge = document.getElementById("cartCountBadge");
    if (!badge) return;
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalCount;
}

// TASK 2: Dynamically render products from the array[cite: 1]
function renderProducts() {
    const container = document.getElementById("productsContainer");
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="card">
            <div class="image">${product.image}</div>
            <h3>${product.name}</h3>
            <p>₹${product.price.toLocaleString("en-IN")}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join("");
}

// TASK 3: Add to Cart click handler & store in localStorage[cite: 1]
function addToCart(productId) {
    let cart = getCart();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    renderCart();
}

// TASK 5: calculateTotal() recalculates grand total using reduce()[cite: 1]
function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// TASK 4: Dynamically render cart with working quantity input & remove button[cite: 1]
function renderCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const grandTotalElement = document.getElementById("grandTotal");
    if (!cartItemsContainer || !grandTotalElement) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="5" style="padding: 20px;">Your cart is empty!</td>
            </tr>
        `;
        grandTotalElement.textContent = "₹0";
        return;
    }

    cart.forEach(item => {
        const row = document.createElement("tr");
        const subtotal = item.price * item.quantity;

        row.innerHTML = `
            <td>${item.image} ${item.name}</td>
            <td>
                <input 
                    type="number" 
                    min="1" 
                    value="${item.quantity}" 
                    style="width: 55px; text-align: center; padding: 4px;"
                    onchange="updateQuantity(${item.id}, this.value)"
                >
            </td>
            <td>₹${item.price.toLocaleString("en-IN")}</td>
            <td>₹${subtotal.toLocaleString("en-IN")}</td>
            <td>
                <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });

    const total = calculateTotal(cart);
    grandTotalElement.textContent = `₹${total.toLocaleString("en-IN")}`;
}

function updateQuantity(productId, newQty) {
    let cart = getCart();
    const qty = parseInt(newQty);

    if (qty <= 0 || isNaN(qty)) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity = qty;
        saveCart(cart);
        renderCart();
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
}

// TASK 6 & 7: Form Validation (Regex) & Order Confirmation[cite: 1]
function setupCheckoutForm() {
    const checkoutForm = document.getElementById("checkoutForm");
    if (!checkoutForm) return;

    checkoutForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const cart = getCart();
        const confirmationBox = document.getElementById("orderConfirmation");

        document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
        confirmationBox.style.display = "none";

        if (cart.length === 0) {
            alert("Your cart is empty! Please add products before checking out.");
            return;
        }

        const name = document.getElementById("custName").value.trim();
        const address = document.getElementById("custAddress").value.trim();
        const pincode = document.getElementById("custPincode").value.trim();
        const phone = document.getElementById("custPhone").value.trim();

        let isValid = true;

        // Name and Address not empty check[cite: 1]
        if (!name) {
            document.getElementById("nameError").textContent = "Name is required.";
            isValid = false;
        }

        if (!address) {
            document.getElementById("addressError").textContent = "Address is required.";
            isValid = false;
        }

        // Pincode: exactly 6 digits[cite: 1]
        const pinRegex = /^\d{6}$/;
        if (!pinRegex.test(pincode)) {
            document.getElementById("pincodeError").textContent = "Pincode must be exactly 6 digits.";
            isValid = false;
        }

        // Phone: exactly 10 digits[cite: 1]
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            document.getElementById("phoneError").textContent = "Phone must be exactly 10 digits.";
            isValid = false;
        }

        if (isValid) {
            // Task 7: Confirmation & Clear cart from localStorage[cite: 1]
            confirmationBox.textContent = "🎉 Order placed successfully! Thank you for shopping with us.";
            confirmationBox.style.display = "block";

            localStorage.removeItem("shopease_cart");
            updateCartBadge();
            renderCart();
            checkoutForm.reset();
        }
    });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    renderProducts();
    renderCart();
    setupCheckoutForm();
});