/*
* clase de item del carrito 
 */
class Item {
    ///atributos
    producto; 
    cantidad; 
    ///constructor
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
    
    ///metodos
    precioTotal() {
        return this.cantidad * this.producto.precio;
    }
}
