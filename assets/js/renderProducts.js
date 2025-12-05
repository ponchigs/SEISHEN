const productsContainer = document.querySelector('#products-container');

// Загружаем товары из JSON
async function getProducts() {
    try {
        const response = await fetch('assets/js/products.json');

        if (!response.ok) {
            throw new Error('Ошибка загрузки products.json: ' + response.status);
        }

        const productsArray = await response.json();
        renderProducts(productsArray);
    } catch (error) {
        console.error(error);
        productsContainer.insertAdjacentHTML(
            'beforeend',
            '<p>Не удалось загрузить меню. Попробуйте позже.</p>'
        );
    }
}

// Рендерим карточки товаров
function renderProducts(productsArray) {
    productsArray.forEach(function (item) {
        const productHTML = `
        <div class="col-md-6 mb-4">
            <div class="card h-100" data-id="${item.id}">
                <img class="product-img" src="assets/img/${item.imgSrc}" alt="${item.title}">
                <div class="card-body text-center">
                    <h4 class="item-title">${item.title}</h4>
                    <p><small data-items-in-box class="text-muted">${item.itemsInBox} шт.</small></p>

                    <div class="details-wrapper">
                        <div class="items counter-wrapper">
                            <div class="items__control" data-action="minus">-</div>
                            <div class="items__current" data-counter>0</div>
                            <div class="items__control" data-action="plus">+</div>
                        </div>

                        <div class="price">
                            <div class="price__weight">${item.weight}</div>
                            <div class="price__currency">${item.price}</div>
                        </div>
                    </div>

                    <button data-cart type="button" class="btn btn-block btn-outline-warning">
                        + в корзину
                    </button>
                </div>
            </div>
        </div>`;
        
        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
}

// Стартуем загрузку
getProducts();
