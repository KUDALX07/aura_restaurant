// ==========================================
// 1. ДАННЫЕ МЕНЮ (СПИСОК БЛЮД)
// ==========================================
const dishes = [
    {
        id: 1,
        title: "Стейк Рибай",
        category: "mains",
        price: 9500,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80",
        description: "Сочный стейк из премиальной говядины сухого вызревания с соусом розмарин.",
        weight: "350г",
        calories: "780 ккал"
    },
    {
        id: 2,
        title: "Паста с морепродуктами",
        category: "mains",
        price: 5200,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        description: "Итальянская паста феттуччине с тигровыми креветками, кальмарами и сливочным соусом.",
        weight: "300г",
        calories: "520 ккал"
    },
    {
        id: 3,
        title: "Тартар из лосося",
        category: "starters",
        price: 4300,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
        description: "Свежий лосось с авокадо, каперсами и хрустящими гренками.",
        weight: "180г",
        calories: "310 ккал"
    },
    {
        id: 4,
        title: "Салат Буррата",
        category: "starters",
        price: 3900,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&w=600&q=80",
        description: "Нежная буррата с томатами черри, соусом песто и кедровыми орехами.",
        weight: "220г",
        calories: "410 ккал"
    },
    {
        id: 5,
        title: "Шоколадный Фондан",
        category: "desserts",
        price: 2400,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
        description: "Теплый десерт с жидкой шоколадной начинкой и шариком ванильного мороженого.",
        weight: "150г",
        calories: "450 ккал"
    },
    {
        id: 6,
        title: "Чизкейк Сан-Себастьян",
        category: "desserts",
        price: 2600,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
        description: "Баскский обожженный чизкейк с нежной текстурой.",
        weight: "170г",
        calories: "380 ккал"
    },
    {
        id: 7,
        title: "Авторский Лимонад Маракуйя",
        category: "drinks",
        price: 1800,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
        description: "Освежающий натуральный лимонад с мятой и маракуйей.",
        weight: "400мл",
        calories: "140 ккал"
    },
    {
        id: 8,
        title: "Эспрессо Тоник",
        category: "drinks",
        price: 1600,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
        description: "Двойной эспрессо с тонизирующим премиальным тоником и долькой лайма.",
        weight: "300мл",
        calories: "80 ккал"
    }
];

// ==========================================
// 2. СОСТОЯНИЕ КОРЗИНЫ
// ==========================================
let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

function saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (cartCountEl) cartCountEl.textContent = totalCount;
    if (cartTotalPrice) cartTotalPrice.textContent = `${totalPrice.toLocaleString()} ₸`;

    if (cartItemsList) {
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">Корзина пуста</p>';
        } else {
            cartItemsList.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <strong>${item.title}</strong>
                        <div style="font-size:0.8rem; color: var(--text-muted);">${item.price} ₸ x ${item.quantity}</div>
                    </div>
                    <div>
                        <button onclick="changeQuantity(${item.id}, -1)" class="btn btn--outline" style="padding:2px 8px;">-</button>
                        <span style="margin: 0 8px;">${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)" class="btn btn--outline" style="padding:2px 8px;">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

function addToCart(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    const existingItem = cart.find(item => item.id === dishId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...dish, quantity: 1 });
    }
    saveCart();
}

function changeQuantity(dishId, delta) {
    const item = cart.find(i => i.id === dishId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== dishId);
    }
    saveCart();
}

// ==========================================
// 3. РЕНДЕР И ФИЛЬТРАЦИЯ КАТАЛОГА (MENU.HTML)
// ==========================================
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

function renderDishes() {
    const grid = document.getElementById('dishes-grid');
    if (!grid) return;

    let filtered = dishes.filter(dish => {
        const matchesCategory = currentCategory === 'all' || dish.category === currentCategory;
        const matchesSearch = dish.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Сортировка
    if (currentSort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Ничего не найдено</p>';
        return;
    }

    grid.innerHTML = filtered.map(dish => `
        <div class="card dish-card">
            <img src="${dish.image}" alt="${dish.title}" class="dish-card__img" onclick="openDishDetail(${dish.id})">
            <div>
                <h3 class="dish-card__title" onclick="openDishDetail(${dish.id})" style="cursor:pointer;">${dish.title}</h3>
                <p class="dish-card__desc">${dish.description}</p>
            </div>
            <div class="dish-card__footer">
                <span class="dish-card__price">${dish.price.toLocaleString()} ₸</span>
                <button class="btn btn--primary" onclick="addToCart(${dish.id})">В корзину</button>
            </div>
        </div>
    `).join('');
}

function openDishDetail(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    const modal = document.getElementById('dish-modal');
    const body = document.getElementById('dish-detail-body');
    if (!dish || !modal || !body) return;

    body.innerHTML = `
        <img src="${dish.image}" alt="${dish.title}" style="width:100%; height:200px; object-fit:cover; border-radius:4px; margin-bottom:15px;">
        <h2>${dish.title}</h2>
        <p style="color:var(--text-muted); margin: 10px 0;">${dish.description}</p>
        <p><strong>Вес:</strong> ${dish.weight} | <strong>Калории:</strong> ${dish.calories}</p>
        <p style="margin-top:10px;"><strong>Рейтинг:</strong> ⭐ ${dish.rating}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
            <span style="font-size:1.4rem; color:var(--accent); font-weight:bold;">${dish.price} ₸</span>
            <button class="btn btn--primary" onclick="addToCart(${dish.id}); closeModal('dish-modal');">Добавить в корзину</button>
        </div>
    `;
    modal.classList.add('active');
}

// ==========================================
// 4. ИНИЦИАЛИЗАЦИЯ И СОБЫТИЯ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    renderDishes();

    // Мобильное меню (Burger)
    const burgerBtn = document.getElementById('burger-btn');
    const navMenu = document.getElementById('nav-menu');
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Обработка кликов модальных окон
    setupModal('open-auth-btn', 'auth-modal', 'close-auth-btn');
    setupModal('open-cart-btn', 'cart-modal', 'close-cart-btn');
    setupModal(null, 'dish-modal', 'close-dish-btn');

    // Переключение вкладок Вход / Регистрация
    const tabLogin = document.getElementById('tab-login-btn');
    const tabReg = document.getElementById('tab-register-btn');
    const formLogin = document.getElementById('login-form');
    const formReg = document.getElementById('register-form');

    if (tabLogin && tabReg) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabReg.classList.remove('active');
            formLogin.classList.add('active');
            formReg.classList.remove('active');
        });
        tabReg.addEventListener('click', () => {
            tabReg.classList.add('active');
            tabLogin.classList.remove('active');
            formReg.classList.add('active');
            formLogin.classList.remove('active');
        });
    }

    // Валидация Формы Авторизации
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const status = document.getElementById('auth-status-msg');
            if (validateEmail(email)) {
                status.style.color = 'var(--success)';
                status.textContent = 'Вы успешно вошли!';
                setTimeout(() => closeModal('auth-modal'), 1200);
            }
        });
    }

    // Валидация Формы Обратной Связи (contacts.html)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('contact-name');
            const email = document.getElementById('contact-email');
            const phone = document.getElementById('contact-phone');
            const msg = document.getElementById('contact-message');

            // Имя
            if (name.value.trim().length < 2) {
                showError('contact-name-error', 'Имя должно содержать от 2 символов');
                isValid = false;
            } else { showError('contact-name-error', ''); }

            // Email
            if (!validateEmail(email.value)) {
                showError('contact-email-error', 'Введите корректный email');
                isValid = false;
            } else { showError('contact-email-error', ''); }

            // Телефон
            if (phone.value.trim().length < 10) {
                showError('contact-phone-error', 'Введите правильный номер телефона');
                isValid = false;
            } else { showError('contact-phone-error', ''); }

            // Сообщение
            if (msg.value.trim().length < 5) {
                showError('contact-message-error', 'Сообщение слишком короткое');
                isValid = false;
            } else { showError('contact-message-error', ''); }

            if (isValid) {
                const successMsg = document.getElementById('contact-success-msg');
                successMsg.style.color = 'var(--success)';
                successMsg.textContent = 'Спасибо! Ваше сообщение отправлено.';
                contactForm.reset();
            }
        });
    }

    // События Поиска, Фильтрации и Сортировки
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderDishes();
        });
    }

    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderDishes();
        });
    });

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderDishes();
        });
    }
});

// Хелперы
function setupModal(openBtnId, modalId, closeBtnId) {
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    if (openBtnId) {
        const openBtn = document.getElementById(openBtnId);
        if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('active'));
    }
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = text;
}