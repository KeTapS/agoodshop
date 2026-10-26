// URL de la API creada en https://jsonblob.com con el JSON de products.json
// (blob: https://jsonblob.com/01a17911-239b-7776-a14b-c5ef0a21090d)
const API_URL = "https://jsonblob.com/api/jsonBlob/01a17911-239b-7776-a14b-c5ef0a21090d";

// Datos de respaldo por si la API no responde (para poder probar en local)
const PRODUCTOS_RESPALDO = {
  currency: "€",
  products: [
    { SKU: "0K3QOSOV4V", title: "iFhone 13 Pro", price: "938.99" },
    { SKU: "TGD5XORY1L", title: "Cargador", price: "49.99" },
    { SKU: "IOKW9BQ9F3", title: "Funda de piel", price: "79.99" },
  ],
};

const tablaProductos = document.getElementById("productos");
const listaResumen = document.getElementById("resumen-lista");
const totalCarrito = document.getElementById("resumen-total");
const estado = document.getElementById("estado");

let carrito;

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
  const datos = await obtenerProductos();
  carrito = new Carrito(datos.products, datos.currency);
  pintarProductos();
  actualizarResumen();
}

// Petición a la API. Si falla, usamos los datos de respaldo.
async function obtenerProductos() {
  try {
    // Si la API tarda más de 5 segundos, cancelamos la petición
    const respuesta = await fetch(API_URL, { signal: AbortSignal.timeout(5000) });
    if (!respuesta.ok) {
      throw new Error(`Error HTTP ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    estado.textContent = "";
    return datos;
  } catch (error) {
    console.warn("No se pudo cargar la API, usando datos locales:", error);
    estado.textContent = "No se pudo conectar con la API. Mostrando datos locales.";
    return PRODUCTOS_RESPALDO;
  }
}

const formatear = (cantidad) => `${Number(cantidad).toFixed(2)}${carrito.currency}`;

// Crea una fila de la tabla por cada producto
function pintarProductos() {
  tablaProductos.innerHTML = "";

  carrito.obtenerProductos().forEach((producto) => {
    const fila = document.createElement("tr");
    fila.dataset.sku = producto.sku;

    // Columna producto
    const celdaProducto = document.createElement("td");
    const titulo = document.createElement("h3");
    titulo.textContent = producto.title;
    const referencia = document.createElement("p");
    referencia.className = "ref";
    referencia.textContent = `REF: ${producto.sku}`;
    celdaProducto.append(titulo, referencia);

    // Columna cantidad: botón -, input, botón +
    const celdaCantidad = document.createElement("td");
    const controles = document.createElement("div");
    controles.className = "cantidad";

    const botonMenos = document.createElement("button");
    botonMenos.type = "button";
    botonMenos.textContent = "-";
    botonMenos.setAttribute("aria-label", `Quitar una unidad de ${producto.title}`);

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.value = producto.quantity;
    input.setAttribute("aria-label", `Unidades de ${producto.title}`);

    const botonMas = document.createElement("button");
    botonMas.type = "button";
    botonMas.textContent = "+";
    botonMas.setAttribute("aria-label", `Añadir una unidad de ${producto.title}`);

    botonMenos.addEventListener("click", () => {
      carrito.sumarUnidades(producto.sku, -1);
      actualizarFila(fila);
    });
    botonMas.addEventListener("click", () => {
      carrito.sumarUnidades(producto.sku, 1);
      actualizarFila(fila);
    });
    input.addEventListener("change", () => {
      carrito.actualizarUnidades(producto.sku, input.value);
      actualizarFila(fila);
    });

    controles.append(botonMenos, input, botonMas);
    celdaCantidad.append(controles);

    // Columna precio unidad
    const celdaPrecio = document.createElement("td");
    celdaPrecio.textContent = formatear(producto.price);

    // Columna total de la línea
    const celdaTotal = document.createElement("td");
    celdaTotal.className = "total-linea";
    celdaTotal.textContent = formatear(0);

    fila.append(celdaProducto, celdaCantidad, celdaPrecio, celdaTotal);
    tablaProductos.append(fila);
  });
}

// Actualiza el input y el total de una fila, y después el resumen
function actualizarFila(fila) {
  const sku = fila.dataset.sku;
  const producto = carrito.obtenerInformacionProducto(sku);
  fila.querySelector("input").value = producto.quantity;
  fila.querySelector(".total-linea").textContent = formatear(carrito.calcularTotalProducto(sku));
  actualizarResumen();
}

// Repinta el apartado TOTAL con los productos seleccionados
function actualizarResumen() {
  const { total, products } = carrito.obtenerCarrito();
  listaResumen.innerHTML = "";

  products.forEach((producto) => {
    const item = document.createElement("li");
    const nombre = document.createElement("span");
    nombre.textContent = `${producto.quantity} x ${producto.title}`;
    const precio = document.createElement("span");
    precio.textContent = `${producto.quantity} x ${formatear(producto.price)}`;
    item.append(nombre, precio);
    listaResumen.append(item);
  });

  totalCarrito.textContent = formatear(total);
}
