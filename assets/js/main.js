// При скролле добавляем/убираем класс для шапки

window.addEventListener('scroll', function () {
    document.getElementById('header-nav').classList.toggle('headernav-scroll', window.scrollY > 135);
});

// ================== Логика корзины ==================

// ================== Вспомогательные функции ==================

function parsePrice(text) {
    const digits = text.replace(/[^\d]/g, '');
    const value = parseInt(digits, 10);
    return isNaN(value) ? 0 : value;
}

// пересчёт суммы по всем карточкам
function recalcCartSummary() {
    const cards = document.querySelectorAll('#products-container .card');
    let total = 0;
    let totalCount = 0;

    cards.forEach(card => {
        const counterEl = card.querySelector('[data-counter]');
        const priceEl = card.querySelector('.price__currency');
        if (!counterEl || !priceEl) return;

        const count = parseInt(counterEl.textContent, 10) || 0;
        const price = parsePrice(priceEl.textContent);

        total += count * price;
        totalCount += count;
    });

// Обновляем сумму во всех .total-price (sidebar + offcanvas)
    document.querySelectorAll('.total-price').forEach(el => {
        el.textContent = total;
    });

// Показывать/прятать "Корзина пуста"
    document.querySelectorAll('[data-cart-empty]').forEach(el => {
        el.style.display = totalCount > 0 ? 'none' : '';
    });
}

// Первый пересчёт при загрузке
document.addEventListener('DOMContentLoaded', recalcCartSummary);

// ================== Логика + / - и "+ в корзину" ==================

document.addEventListener('click', function (event) {

// --- Кнопки +/- ---
    const actionBtn = event.target.closest('[data-action]');
    if (actionBtn) {
        const action = actionBtn.dataset.action;
        const counterWrapper = actionBtn.closest('.counter-wrapper');
        if (!counterWrapper) return;

        const counterEl = counterWrapper.querySelector('[data-counter]');
        if (!counterEl) return;

        let current = parseInt(counterEl.textContent, 10) || 0;

        if (action === 'plus') {
            current += 1;
        } else if (action === 'minus') {
            if (current > 0) {
                current -= 1;
            }
        }

        counterEl.textContent = current;
        recalcCartSummary();
        return;
    }

// --- Кнопка "+ в корзину" ---
    const addToCartBtn = event.target.closest('[data-cart]');
    if (addToCartBtn) {
        const card = addToCartBtn.closest('.card');
        if (!card) return;

        const counterEl = card.querySelector('[data-counter]');
        if (!counterEl) return;

        let current = parseInt(counterEl.textContent, 10) || 0;
        current += 1;
        counterEl.textContent = current;

        recalcCartSummary();
    }
});

// ================== Отправка заказа на Bing ==================

(function () {
    const orderFormWrappers = document.querySelectorAll('#order-form');
    if (!orderFormWrappers.length) return;

    orderFormWrappers.forEach(wrapper => {
        const form = wrapper.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();

// Телефон
            const phoneInput = form.querySelector('input[type="text"]');
            const phone = phoneInput ? phoneInput.value.trim() : '';

// Собираем выбранные позиции (только название + количество)
            const cards = document.querySelectorAll('#products-container .card');
            const items = [];

            cards.forEach(card => {
                const titleEl = card.querySelector('.item-title');
                const counterEl = card.querySelector('[data-counter]');
                if (!titleEl || !counterEl) return;

                const count = parseInt(counterEl.textContent, 10) || 0;
                if (count <= 0) return;

                const title = titleEl.textContent.trim();
                items.push(`${title}: ${count}`);
            });

// Строка для отправки
            const orderText = [
                `Телефон: ${phone || 'не указан'}`,
                `Заказ: ${items.length ? items.join(', ') : 'ничего не выбрано'}`
            ].join(' | ');

// Скрытое поле q
            let qInput = form.querySelector('input[name="q"]');
            if (!qInput) {
                qInput = document.createElement('input');
                qInput.type = 'hidden';
                qInput.name = 'q';
                form.appendChild(qInput);
            }
            qInput.value = orderText;

            // Отправляем форму
            form.action = 'https://www.bing.com/search';
            form.method = 'GET';
            form.submit();
        });
    });
})();
