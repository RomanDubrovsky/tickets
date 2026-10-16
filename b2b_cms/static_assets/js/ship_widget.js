/**
 * NATIVE INTERACTIVE SHIP SEATING WIDGET (B2B CMS)
 * 100% independent vector SVG seating engine with real-time zone pricing & booking
 */
(function() {
    'use strict';

    function initShipWidget(container) {
        if (!container || container.dataset.initialized) return;
        container.dataset.initialized = 'true';

        const sessionId = container.dataset.sessionId || '1';
        const eventId = container.dataset.eventId || '';
        const domainId = container.dataset.domainId || '';
        const primaryColor = container.dataset.primaryColor || '#e55f2e';

        let sessionData = null;
        let selectedSeats = [];
        let occupiedSeats = [];
        let svgElement = null;

        // Create widget markup skeleton
        container.innerHTML = `
            <div class="ship-widget-root">
                <div class="ship-widget-card">
                    <!-- Header -->
                    <div class="ship-widget-header">
                        <div class="ship-widget-title-box">
                            <h3 id="sw-event-title">Загрузка рейса...</h3>
                            <div class="ship-meta">
                                <span id="sw-date-time"><i class="bi bi-calendar"></i> —</span>
                                <span id="sw-pier-address"><i class="bi bi-geo-alt"></i> —</span>
                                <span id="sw-ship-name"><i class="bi bi-water"></i> —</span>
                            </div>
                        </div>
                        <div class="ship-session-selector">
                            <select id="sw-session-select" style="display:none;"></select>
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="ship-widget-legend">
                        <div class="legend-item"><span class="legend-dot vip-nose"></span> VIP Нос (Панорама)</div>
                        <div class="legend-item"><span class="legend-dot vip-stage"></span> VIP Сцена</div>
                        <div class="legend-item"><span class="legend-dot saloon"></span> Салон / Танцпол</div>
                        <div class="legend-item"><span class="legend-dot upper-closed"></span> Верхняя закрытая</div>
                        <div class="legend-item"><span class="legend-dot upper-open"></span> Верхняя открытая</div>
                        <div class="legend-item"><span class="legend-dot occupied"></span> Занято</div>
                        <div class="legend-item"><span class="legend-dot selected"></span> Выбрано</div>
                    </div>

                    <!-- Viewport -->
                    <div class="ship-vessel-viewport" id="sw-viewport">
                        <div class="sw-loading" style="color: #94a3b8; padding: 40px; font-weight: 600;">
                            Загрузка схемы теплохода...
                        </div>
                        <div class="ship-seat-tooltip" id="sw-tooltip"></div>
                    </div>

                    <!-- Bottom Dock -->
                    <div class="ship-widget-dock">
                        <div class="ship-selected-summary">
                            <span class="count-badge" id="sw-count-badge">0 мест</span>
                            <span id="sw-seats-text">Выберите столик на схеме</span>
                            <span class="ship-total-price" id="sw-total-price">0 ₽</span>
                        </div>
                        <button class="ship-btn-checkout" id="sw-btn-checkout" disabled style="background: ${primaryColor};">
                            Оформить билеты
                        </button>
                    </div>
                </div>

                <!-- Checkout Modal -->
                <div class="ship-modal-overlay" id="sw-modal">
                    <div class="ship-modal-box">
                        <div class="ship-modal-header">
                            <h4>Оформление билетов</h4>
                            <button class="ship-modal-close" id="sw-modal-close">&times;</button>
                        </div>
                        <div class="ship-modal-body" id="sw-modal-body">
                            <div class="ship-order-summary-box">
                                <div class="ship-order-summary-row">
                                    <span>Программа:</span>
                                    <strong id="sw-modal-event">—</strong>
                                </div>
                                <div class="ship-order-summary-row">
                                    <span>Рейс:</span>
                                    <strong id="sw-modal-time">—</strong>
                                </div>
                                <div class="ship-order-summary-row">
                                    <span>Выбранные места:</span>
                                    <strong id="sw-modal-seats" style="color:#38bdf8;">—</strong>
                                </div>
                                <div class="ship-order-summary-row total">
                                    <span>Итого к оплате:</span>
                                    <strong id="sw-modal-total" style="color:#4ade80;">0 ₽</strong>
                                </div>
                            </div>

                            <form id="sw-checkout-form">
                                <div class="ship-form-group">
                                    <label>Ваше Имя и Фамилия *</label>
                                    <input type="text" class="ship-form-control" id="sw-cust-name" required placeholder="Иван Иванов">
                                </div>
                                <div class="ship-form-group">
                                    <label>Номер телефона *</label>
                                    <input type="tel" class="ship-form-control" id="sw-cust-phone" required placeholder="+7 (999) 000-00-00">
                                </div>
                                <div class="ship-form-group">
                                    <label>Электронная почта (для билетов) *</label>
                                    <input type="email" class="ship-form-control" id="sw-cust-email" required placeholder="name@example.com">
                                </div>
                                <div class="ship-form-group">
                                    <label>Промокод / Карта постоянного гостя</label>
                                    <input type="text" class="ship-form-control" id="sw-cust-promo" placeholder="PROMO2026">
                                </div>
                                <button type="submit" class="ship-btn-submit" id="sw-btn-pay">
                                    Оплатить заказ онлайн
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const viewport = container.querySelector('#sw-viewport');
        const tooltip = container.querySelector('#sw-tooltip');
        const countBadge = container.querySelector('#sw-count-badge');
        const seatsText = container.querySelector('#sw-seats-text');
        const totalPriceEl = container.querySelector('#sw-total-price');
        const btnCheckout = container.querySelector('#sw-btn-checkout');
        const modal = container.querySelector('#sw-modal');
        const modalClose = container.querySelector('#sw-modal-close');
        const form = container.querySelector('#sw-checkout-form');

        // Load Session Data
        fetch(`/api/widget/session/${sessionId}`)
            .then(res => res.json())
            .then(data => {
                sessionData = data;
                occupiedSeats = data.occupied_seats || [];

                container.querySelector('#sw-event-title').textContent = data.event_title || 'Музыкальный круиз';
                container.querySelector('#sw-date-time').innerHTML = `<i class="bi bi-calendar"></i> ${data.formatted_date || data.start_time}`;
                container.querySelector('#sw-pier-address').innerHTML = `<i class="bi bi-geo-alt"></i> ${data.pier_address || 'Наб. Макарова, 34'}`;
                container.querySelector('#sw-ship-name').innerHTML = `<i class="bi bi-water"></i> ${data.venue_name || 'Теплоход «Рок Хит Нева»'}`;

                // Fetch Scheme SVG
                const svgUrl = data.scheme_svg_url || '/ships_schemes/rock_hit_neva_scheme.svg';
                return fetch(svgUrl);
            })
            .then(res => res.text())
            .then(svgText => {
                let cleaned = svgText.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!DOCTYPE[^>]*>/gi, '');
                viewport.innerHTML = cleaned;
                viewport.appendChild(tooltip);
                svgElement = viewport.querySelector('svg');

                if (svgElement) {
                    svgElement.setAttribute('width', '100%');
                    svgElement.setAttribute('height', '100%');
                    bindSvgEvents();
                }
            })
            .catch(err => {
                console.error('Widget load error:', err);
                viewport.innerHTML = '<div style="color:#ef4444; padding:30px;">Не удалось загрузить схему теплохода.</div>';
            });

        // Hook SVG elements
        function bindSvgEvents() {
            if (!svgElement) return;

            const seatGroups = svgElement.querySelectorAll('g[data-seat-number]');
            const basePrice = sessionData?.base_price || 1750;
            const zonePrices = sessionData?.zone_prices || {};

            seatGroups.forEach(g => {
                const seatNum = g.getAttribute('data-seat-number');
                const tableNum = g.getAttribute('data-table-number') || seatNum;
                const sectionId = g.getAttribute('data-section-id') || '3';

                // Determine price
                let seatPrice = zonePrices[sectionId] || basePrice;
                if (!zonePrices[sectionId]) {
                    if (sectionId === '1') seatPrice = basePrice + 3000; // VIP Нос ~ 4750
                    else if (sectionId === '2') seatPrice = basePrice + 1250; // VIP Сцена ~ 3000
                    else if (sectionId === '3') seatPrice = basePrice + 750;  // Салон/Бар ~ 2500
                    else if (sectionId === '4') seatPrice = basePrice + 200;  // Верхняя закрытая ~ 1950
                    else seatPrice = basePrice;
                }

                g.dataset.price = seatPrice;
                g.dataset.table = tableNum;
                g.dataset.seat = seatNum;

                // Check if occupied
                if (occupiedSeats.includes(String(seatNum))) {
                    g.classList.add('is-occupied');
                }

                // Mouse hover tooltip
                g.addEventListener('mouseenter', (e) => {
                    if (g.classList.contains('is-occupied')) {
                        tooltip.innerHTML = `<div class="tt-title">Стол ${tableNum}, Место ${seatNum}</div><div style="color:#94a3b8;">Место занято</div>`;
                    } else {
                        const zoneName = getZoneName(sectionId);
                        tooltip.innerHTML = `
                            <div class="tt-title">Стол ${tableNum}, Место ${seatNum}</div>
                            <div style="color:#cbd5e1; font-size:0.78rem;">${zoneName}</div>
                            <div class="tt-price">${seatPrice.toLocaleString('ru-RU')} ₽</div>
                        `;
                    }
                    tooltip.style.display = 'block';
                    positionTooltip(e);
                });

                g.addEventListener('mousemove', (e) => {
                    positionTooltip(e);
                });

                g.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });

                // Seat Click Selection
                g.addEventListener('click', () => {
                    if (g.classList.contains('is-occupied')) return;

                    const sId = String(seatNum);
                    const idx = selectedSeats.findIndex(s => s.id === sId);

                    if (idx >= 0) {
                        selectedSeats.splice(idx, 1);
                        g.classList.remove('is-selected');
                    } else {
                        selectedSeats.push({
                            id: sId,
                            table: tableNum,
                            seat: seatNum,
                            sectionId: sectionId,
                            price: seatPrice
                        });
                        g.classList.add('is-selected');
                    }

                    updateSelectionUI();
                });
            });
        }

        function positionTooltip(e) {
            const rect = viewport.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        }

        function getZoneName(secId) {
            switch(String(secId)) {
                case '1': return 'VIP Нос (Панорама)';
                case '2': return 'VIP Сцена';
                case '3': return 'Главный салон (Бар/Танцпол)';
                case '4': return 'Верхняя палуба (Закрытая)';
                case '5': return 'Верхняя палуба (Открытая)';
                default: return 'Салон';
            }
        }

        function updateSelectionUI() {
            const count = selectedSeats.length;
            countBadge.textContent = `${count} ${pluralizeSeats(count)}`;

            if (count === 0) {
                seatsText.textContent = 'Выберите столик на схеме';
                totalPriceEl.textContent = '0 ₽';
                btnCheckout.disabled = true;
            } else {
                const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
                const desc = selectedSeats.map(s => `Стол ${s.table} (м.${s.seat})`).join(', ');
                seatsText.textContent = desc;
                totalPriceEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
                btnCheckout.disabled = false;
            }
        }

        function pluralizeSeats(n) {
            if (n % 10 === 1 && n % 100 !== 11) return 'место';
            if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'места';
            return 'мест';
        }

        // Checkout Button Click
        btnCheckout.addEventListener('click', () => {
            if (selectedSeats.length === 0) return;
            const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

            container.querySelector('#sw-modal-event').textContent = sessionData.event_title;
            container.querySelector('#sw-modal-time').textContent = sessionData.formatted_date || sessionData.start_time;
            container.querySelector('#sw-modal-seats').textContent = selectedSeats.map(s => `Стол ${s.table} М.${s.seat}`).join(', ');
            container.querySelector('#sw-modal-total').textContent = `${total.toLocaleString('ru-RU')} ₽`;

            // Auto-fill stored promo if present in URL/localStorage
            const storedPromo = localStorage.getItem('ship_partner_promo');
            if (storedPromo) {
                container.querySelector('#sw-cust-promo').value = storedPromo;
            }

            modal.classList.add('is-active');
        });

        modalClose.addEventListener('click', () => {
            modal.classList.remove('is-active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('is-active');
        });

        // Form Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btnPay = container.querySelector('#sw-btn-pay');
            btnPay.disabled = true;
            btnPay.textContent = 'Формирование заказа...';

            const payload = {
                sessionId: sessionId,
                customer: {
                    name: container.querySelector('#sw-cust-name').value,
                    phone: container.querySelector('#sw-cust-phone').value,
                    email: container.querySelector('#sw-cust-email').value,
                    promo: container.querySelector('#sw-cust-promo').value
                },
                seats: selectedSeats
            };

            fetch('/api/widget/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    const modalBody = container.querySelector('#sw-modal-body');
                    modalBody.innerHTML = `
                        <div style="text-align: center; padding: 20px 10px;">
                            <div style="font-size: 3rem; color: #10b981; margin-bottom: 10px;">✓</div>
                            <h3 style="color: #fff; margin-bottom: 10px;">Заказ №${res.orderId} успешно создан!</h3>
                            <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">
                                Электронные билеты отправлены на <strong>${payload.customer.email}</strong>.
                            </p>
                            <div style="background: #0f172a; padding: 15px; border-radius: 10px; margin: 20px 0; border: 1px dashed #38bdf8;">
                                <div style="color: #94a3b8; font-size: 0.8rem; margin-bottom: 4px;">Штрих-код билетов:</div>
                                <div style="font-family: monospace; font-size: 1.2rem; font-weight: 700; color: #38bdf8; letter-spacing: 2px;">
                                    ${res.barcode || '29384910283921'}
                                </div>
                            </div>
                            <button onclick="location.reload()" class="ship-btn-submit" style="background:#0284c7;">
                                Готово
                            </button>
                        </div>
                    `;
                } else {
                    alert('Ошибка оформления: ' + (res.message || 'Попробуйте позже'));
                    btnPay.disabled = false;
                    btnPay.textContent = 'Оплатить заказ онлайн';
                }
            })
            .catch(err => {
                alert('Сетевая ошибка: ' + err.message);
                btnPay.disabled = false;
                btnPay.textContent = 'Оплатить заказ онлайн';
            });
        });
    }

    // Auto-initialize on DOM ready
    function scanAndInit() {
        document.querySelectorAll('.ship-ticket-widget, #ship-ticket-widget, #ship-deck-widget').forEach(initShipWidget);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAndInit);
    } else {
        scanAndInit();
    }

    window.initShipWidget = initShipWidget;
})();
