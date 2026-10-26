# AgoodShop – Carrito de la compra

Actividad 1 de Desarrollo Web en Entorno Cliente: carrito de la compra de una tienda online ficticia.

## Estructura

```
index.html        Maqueta de la página
css/styles.css    Estilos
js/Carrito.js     Clase Carrito (datos y cálculos, sin acceso al DOM)
js/app.js         Petición a la API, creación del listado y eventos del DOM
products.json     JSON usado para crear la API en jsonblob.com
```

## Clase `Carrito`

| Método | Descripción |
|---|---|
| `constructor(productos, currency)` | Recibe los productos de la API y la moneda |
| `actualizarUnidades(sku, unidades)` | Fija las unidades de un producto (mínimo 0) |
| `sumarUnidades(sku, delta)` | Suma o resta unidades (botones + y -) |
| `obtenerInformacionProducto(sku)` | Datos del producto y unidades seleccionadas |
| `calcularTotalProducto(sku)` | Precio × unidades de una línea |
| `obtenerProductos()` | Todos los productos |
| `obtenerCarrito()` | `{ total, currency, products }` con los productos seleccionados |

## API

Los productos se piden con `fetch` a una API creada en [jsonblob.com](https://jsonblob.com) con el contenido de `products.json`.
La URL está en la constante `API_URL` de `js/app.js`. Si la API no responde, se usan unos datos de respaldo para poder probar la página.

## Cómo probarlo

Abrir `index.html` en el navegador (o con la extensión Live Server de VS Code).
