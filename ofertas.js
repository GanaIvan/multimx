(function() {
    function transformarPrecios() {
        const selectores = [
            '.wc-block-components-product-price__value', 
            '.wc-block-components-totals-footer-item-tax-value', 
            '.gspb_price_value',
            '.gspb_woocartmenu-amount', // El monto en el botón del carrito que pasaste
            '.woocommerce-Price-amount', // Clase estándar de WooCommerce
            '.price'
        ];

        document.querySelectorAll(selectores.join(',')).forEach(el => {
            // Evitamos procesar si ya tiene el descuento o si tiene hijos complejos
            // (esto último para no romper iconos de moneda)
            if (el.dataset.processed) return;

            let texto = el.innerText.trim();
            if (!texto.includes('$')) return;

            // Limpieza: quitamos $, espacios y manejamos la coma decimal
            let numeroLimpio = texto.replace(/[^\d,.]/g, '').replace(',', '.');
            let precio = parseFloat(numeroLimpio);

            if (!isNaN(precio) && precio > 0) {
                el.dataset.processed = "true";
                let mitad = (precio / 2).toFixed(2).replace('.', ',');
                
                // Aplicamos el cambio visual
                el.innerHTML = `
                    <span style="text-decoration: line-through; color: gray; font-size: 0.8em; opacity: 0.7; font-weight: normal;">
                        ${texto}
                    </span><br>
                    <span style="color: #ff5a14; font-weight: bold; font-size: 1.1em;">
                        $${mitad}
                    </span>
                `;
            }
        });
    }

    // Ejecución inicial
    transformarPrecios();

    // El observador es clave aquí porque Greenshift actualiza el carrito 
    // dinámicamente cuando agregas productos.
    const observer = new MutationObserver((mutations) => {
        transformarPrecios();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();