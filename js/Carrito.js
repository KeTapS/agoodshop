/**
 * Clase Carrito
 * Guarda la información de los productos y las unidades seleccionadas
 * y se encarga de todos los cálculos. No conoce nada del DOM.
 */
class Carrito {
  /**
   * @param {Array<{SKU: string, title: string, price: string|number}>} productos
   * @param {string} currency Símbolo de la moneda (por defecto "€")
   */
  constructor(productos = [], currency = "€") {
    this.currency = currency;
    // Guardamos los productos indexados por SKU para acceder rápido a ellos
    this.productos = new Map();
    productos.forEach((producto) => {
      this.productos.set(producto.SKU, {
        sku: producto.SKU,
        title: producto.title,
        price: Number(producto.price),
        quantity: 0,
      });
    });
  }

  /**
   * Actualiza el número de unidades que se quieren comprar de un producto.
   * Las unidades nunca pueden ser negativas ni decimales.
   */
  actualizarUnidades(sku, unidades) {
    const producto = this.productos.get(sku);
    if (!producto) {
      throw new Error(`El producto con SKU ${sku} no existe`);
    }
    const cantidad = Math.max(0, Math.floor(Number(unidades) || 0));
    producto.quantity = cantidad;
    return cantidad;
  }

  /** Suma (o resta, si es negativo) unidades a un producto. */
  sumarUnidades(sku, delta) {
    const actuales = this.obtenerInformacionProducto(sku).quantity;
    return this.actualizarUnidades(sku, actuales + delta);
  }

  /** Devuelve los datos de un producto además de las unidades seleccionadas. */
  obtenerInformacionProducto(sku) {
    const producto = this.productos.get(sku);
    if (!producto) {
      throw new Error(`El producto con SKU ${sku} no existe`);
    }
    return { ...producto };
  }

  /** Devuelve el total de una línea (precio x unidades) con dos decimales. */
  calcularTotalProducto(sku) {
    const { price, quantity } = this.obtenerInformacionProducto(sku);
    return (price * quantity).toFixed(2);
  }

  /** Devuelve todos los productos (seleccionados o no). */
  obtenerProductos() {
    return [...this.productos.values()].map((producto) => ({ ...producto }));
  }

  /**
   * Devuelve la información de los productos añadidos al carrito
   * (los que tienen al menos una unidad) además del total calculado.
   */
  obtenerCarrito() {
    const products = this.obtenerProductos().filter((p) => p.quantity > 0);
    const total = products.reduce((suma, p) => suma + p.price * p.quantity, 0);
    return {
      total: total.toFixed(2),
      currency: this.currency,
      products,
    };
  }
}
