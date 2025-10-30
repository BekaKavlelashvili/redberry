document.documentElement.classList.add('is-js');

const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('.primary-navigation');
const body = document.body;

if (primaryNav) {
    const navItems = primaryNav.querySelectorAll('.nav-item');

    navItems.forEach((item) => {
        const trigger = item.querySelector('a');
        const mega = item.querySelector('.nav-mega');

        if (!trigger) {
            return;
        }

        let closeTimeout;

        const openItem = () => {
            clearTimeout(closeTimeout);
            item.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
        };

        const closeItem = () => {
            clearTimeout(closeTimeout);
            item.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        };

        const scheduleClose = () => {
            clearTimeout(closeTimeout);
            closeTimeout = window.setTimeout(() => {
                const stillHovering = item.matches(':hover');
                const hasFocus = item.contains(document.activeElement);
                if (!stillHovering && !hasFocus) {
                    closeItem();
                }
            }, 220);
        };

        trigger.setAttribute('aria-expanded', 'false');

    const pointerTargets = [item, trigger, mega].filter(Boolean);

        pointerTargets.forEach((target) => {
            target.addEventListener('pointerenter', (event) => {
                if (event.pointerType === 'touch') {
                    return;
                }
                openItem();
            });

            target.addEventListener('pointerleave', (event) => {
                if (event.pointerType === 'touch') {
                    return;
                }
                scheduleClose();
            });
        });

        item.addEventListener('focusin', openItem);
        item.addEventListener('focusout', (event) => {
            if (!item.contains(event.relatedTarget)) {
                scheduleClose();
            }
        });

        item.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeItem();
                trigger.focus();
            }
        });
    });
}

if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!isExpanded));
        if (!isExpanded) {
            primaryNav.dataset.open = 'true';
            body.dataset.navOpen = 'true';
        } else {
            delete primaryNav.dataset.open;
            delete body.dataset.navOpen;
        }
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            delete primaryNav.dataset.open;
            delete body.dataset.navOpen;
        });
    });
}

const motionSections = document.querySelectorAll('.motion-section');

if (motionSections.length) {
    if ('IntersectionObserver' in window) {
        const motionObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                root: null,
                threshold: 0.25,
                rootMargin: '0px 0px -10% 0px',
            }
        );

        motionSections.forEach((section) => {
            motionObserver.observe(section);
        });
    } else {
        motionSections.forEach((section) => section.classList.add('is-visible'));
    }
}

const cartControl = document.querySelector('.cart-control');
const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const cartState = {
    items: [],
};

let openCart = () => {};
let closeCart = () => {};

const renderCart = () => {
    if (!cartControl) {
        return;
    }

    const cartBadge = cartControl.querySelector('[data-cart-count]');
    const cartList = cartControl.querySelector('[data-cart-list]');
    const cartTotal = cartControl.querySelector('[data-cart-total]');
    const cartStatus = cartControl.querySelector('[data-cart-empty-message]');
    const cartFooter = cartControl.querySelector('[data-cart-footer]');

    const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartBadge) {
        cartBadge.textContent = String(totalItems);
        cartBadge.classList.toggle('is-active', totalItems > 0);
    }

    if (cartStatus) {
        cartStatus.hidden = totalItems > 0;
    }

    if (cartFooter) {
        cartFooter.hidden = totalItems === 0;
    }

    if (cartList) {
        cartList.innerHTML = '';
        if (totalItems > 0) {
            cartState.items.forEach((item) => {
                const listItem = document.createElement('li');
                listItem.className = 'cart-panel__item';

                const itemDetails = document.createElement('div');
                itemDetails.className = 'cart-panel__item-details';

                if (item.image) {
                    const itemImage = document.createElement('div');
                    itemImage.className = 'cart-panel__item-image';
                    itemImage.style.backgroundImage = `url("${item.image}")`;
                    listItem.appendChild(itemImage);
                }

                const itemTitle = document.createElement('p');
                itemTitle.className = 'cart-panel__item-title';
                itemTitle.textContent = item.name;

                const itemQuantity = document.createElement('p');
                itemQuantity.className = 'cart-panel__item-qty';
                itemQuantity.textContent = `Qty: ${item.quantity}`;

                const itemPrice = document.createElement('p');
                itemPrice.className = 'cart-panel__item-price';
                itemPrice.textContent = currencyFormatter.format(item.price * item.quantity);

                itemDetails.appendChild(itemTitle);
                itemDetails.appendChild(itemQuantity);

                listItem.appendChild(itemDetails);
                listItem.appendChild(itemPrice);

                cartList.appendChild(listItem);
            });
        }
    }

    if (cartTotal) {
        cartTotal.textContent = currencyFormatter.format(totalPrice);
    }
};

const addToCart = (product) => {
    const existingItem = cartState.items.find((item) => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartState.items.push({ ...product, quantity: 1 });
    }

    renderCart();
    openCart();
};

if (cartControl) {
    const cartButton = cartControl.querySelector('[data-cart-toggle]');
    const cartPanel = cartControl.querySelector('[data-cart-panel]');
    let cartCloseTimeout;

    openCart = () => {
        cartControl.dataset.open = 'true';
        if (cartButton) {
            cartButton.setAttribute('aria-expanded', 'true');
        }
        clearTimeout(cartCloseTimeout);
    };

    closeCart = () => {
        delete cartControl.dataset.open;
        if (cartButton) {
            cartButton.setAttribute('aria-expanded', 'false');
        }
        clearTimeout(cartCloseTimeout);
    };

    const scheduleCartClose = () => {
        clearTimeout(cartCloseTimeout);
        cartCloseTimeout = window.setTimeout(() => {
            const hovering = cartControl.matches(':hover');
            const hasFocus = cartControl.contains(document.activeElement);
            if (!hovering && !hasFocus) {
                closeCart();
            }
        }, 220);
    };

    const toggleCart = () => {
        if (cartControl.dataset.open === 'true') {
            closeCart();
        } else {
            openCart();
        }
    };

    if (cartButton) {
        cartButton.addEventListener('click', (event) => {
            event.preventDefault();
            toggleCart();
        });

        cartButton.addEventListener('focus', openCart);
    }

    const handlePointerLeave = (event) => {
        if (event.pointerType === 'touch') {
            return;
        }
        scheduleCartClose();
    };

    const handlePointerEnter = (event) => {
        if (event.pointerType === 'touch') {
            return;
        }
        openCart();
    };

    if (cartPanel) {
        cartPanel.addEventListener('pointerenter', handlePointerEnter);
        cartPanel.addEventListener('pointerleave', handlePointerLeave);
        cartPanel.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeCart();
                cartButton?.focus();
            }
        });
    }

    cartControl.addEventListener('pointerenter', handlePointerEnter);
    cartControl.addEventListener('pointerleave', handlePointerLeave);
    cartControl.addEventListener('focusin', openCart);
    cartControl.addEventListener('focusout', (event) => {
        if (!cartControl.contains(event.relatedTarget)) {
            scheduleCartClose();
        }
    });

    document.addEventListener('pointerdown', (event) => {
        if (!cartControl.contains(event.target)) {
            closeCart();
        }
    });
}

if (addToCartButtons.length) {
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-product-id');
            const name = button.getAttribute('data-product-name');
            const priceValue = Number(button.getAttribute('data-product-price'));
            const image = button.getAttribute('data-product-image');

            if (!id || !name || Number.isNaN(priceValue)) {
                return;
            }

            addToCart({ id, name, price: priceValue, image });
        });
    });
}

renderCart();
