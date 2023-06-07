async function lala() {
  const endpoint = "http://api.mercadolibre.com";
  const header = {
    Authorization: "Bearer APP_USR-12345678-031820-X-12345678",
  };
  const params = {
    q: "fernet",
    limit: 1,
  };
  const { data } = await axios.get(
    `${endpoint}/sites/MLA/search`,
    { header },
    { params }
  );
  console.warn("lala: ", data);
}

lala();

function verificarEdad() {
  // Muestra un cuadro de diálogo de SweetAlert2 con un campo de entrada personalizado
  Swal.fire({
    title: "Bienvenido al carrito de bebidas",
    text: "Para comprar en el carrito de bebidas debes tener más de 18 años de edad.",
    input: "number",
    inputAttributes: {
      min: "1",
      max: "120",
      step: "1",
    },
    inputValidator: (value) => {
      if (!value || value < 18) {
        return "Debes tener al menos 18 años";
      }
    },
    showCancelButton: true,
    confirmButtonText: "Aceptar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      // Si la edad es válida y mayor o igual a 18, muestra un mensaje de bienvenida
      Swal.fire({
        title: "Genial, ya estás dentro de la tienda",
        text: "Disfruta de nuestras bebidas. Esperamos tu compra.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Si se cancela la entrada de la edad, redirecciona a una página de internet
      window.location.href =
        "https://amazing-dolphin-a9c593.netlify.app/";
    } else {
      // Si la edad ingresada es insuficiente, muestra un mensaje de restricción y redirecciona
      Swal.fire({
        title: "Acceso restringido",
        text: "Debes tener al menos 18 años para acceder al carrito de bebidas.",
        icon: "error",
        confirmButtonText: "Aceptar",
      }).then(() => {
        window.location.href = "index"; // Reemplaza con el enlace a la página de internet que desees
      });
    }
  });
}

// Llama a la función para verificar la edad
verificarEdad();

let carrito = []; ///aqui iran los items del carrito
let stock = []; ///aqui iran los productos

////traerme los elementos del dom
const tabla = document.getElementById("items");
const selectProductos = document.getElementById("productos");
const btnAgregar = document.getElementById("agregar");
const btnOrdenar = document.getElementById("ordenar");
const btnVaciar = document.getElementById("vaciar");
const total = document.getElementById("total");

const subtotal = (precio, cantidad) => precio * cantidad;

///ejecutar una vez para cargar el localStorage con stock

stock.push(new Producto("Gin", "Bombay", "750ml", 7000, "https://as1.ftcdn.net/v2/jpg/04/28/74/80/1000_F_428748091_wOQc0GyfPts0mUF8h28272euyLwzj4eW.jpg" ));
stock.push(new Producto("Whisky", "Chivas Regal", "1L", 14000, "https://labebidadetusfiestas.com.ar/38736-large_default/whisky-chivas-regal-12-anos-estuche-700cc.jpg"));
stock.push(new Producto("Cerveza", "Corona", "710 ml", 700, "https://beermarket.com.ar/wp-content/uploads/2020/11/7501064106859.jpg"));
stock.push(new Producto("Fernet", "Branca", "1L", 2400, "https://quirinobebidas.com.ar/wp-content/uploads/2020/06/Fernet-Branca-2.jpg"));
stock.push(new Producto("Tequila", "Jose Cuervo", "750ml", 10000, "https://whiskypedia.com.ar/wp-content/uploads/2020/06/Tequila-Jose-Cuervo-Reposado-750-ml.jpg"));
stock.push(new Producto("Vodka", "Absolut", "700ml", 5100, "https://www.alcodisonline.es/pub/media/catalog/product/cache/e4d64343b1bc593f1c5348fe05efa4a6/1/_/vodka-absolut-blue-40-i1-1468.jpg"));
stock.push(new Producto("Extra bruit", "Chandon", "750ml", 2500, "https://d2r9epyceweg5n.cloudfront.net/stores/002/150/004/products/champagne_chandon-extra-brut1-8aa0c270ce06b8f0df16542700951968-640-0.jpg"));
stock.push(new Producto("Vino Malbec", "Portillo", "750ml", 1100, "https://quirinobebidas.com.ar/wp-content/uploads/2020/07/EL-PORTILLO-MB.jpg"));
stock.push(new Producto("Vino Blanco", "Portillo", "750ml", 1100, "https://www.espaciovino.com.ar/media/default/0001/59/thumb_58924_default_big.jpeg" ));
stock.push(new Producto("Gaseosa", "Coca-Cola", "2,25L", 700, "https://quirinobebidas.com.ar/wp-content/uploads/2020/08/LOS-PRIMEROS-10-LLEVAN-PLACA-DE-REGALO-11.png"));
stock.push(new Producto("Jugo de naranja", "Cepita", "1L", 450, "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT3H8cAWLTtfojwSODywqsBHYbMbP2lC7rvQwsuXrWKXxSftX3zvVe6-76kfjCP5Gkp5OjG9fO27mXGEmIN7QU3FMVXPRdnAKyoQNKJ1eOwQwXzMnfV7GWIvA"));
stock.push(new Producto("Energizante", "Speed", "269ml", 300, "http://delivery.desanrafael.ar/contenidos/495_1.jpg"));

localStorage.setItem("stock", JSON.stringify(stock));

allEventListeners();

function allEventListeners() {
  ////agregamos un escuchador del evento cuando el DOM se carga
  window.addEventListener("DOMContentLoaded", traerItems);
  btnVaciar.addEventListener("click", vaciarCarrito);

  ///event listener de agregar un producto al carrito
  btnAgregar.addEventListener("submit", (e) => {
    e.preventDefault(); ///evito el refresque
    const productoSeleccionado = stock[+selectProductos.value]; ///obtengo el producto elegido
    console.log(productoSeleccionado);
    const indiceCarrito = carrito.findIndex((item) => {
      return item.producto.nombre == productoSeleccionado.nombre;
    });
    console.log(indiceCarrito);
    if (indiceCarrito != -1) {
      carrito[indiceCarrito].cantidad++;
    } else {
      const item = new Item(productoSeleccionado, 1);
      carrito.push(item);
    }

    actualizarTablaCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito)); //actualizo el carrito en el localStorage
  });
}

function traerItems() {
  ///traer los productos del localStorage
  ///si no hay nada inicializara stock en vacio []
  stock = JSON.parse(localStorage.getItem("stock")) || [];
  carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  generarCardsProductos();
  actualizarTablaCarrito();
}

function generarCardsProductos() {
  const container = document.getElementById("productos-container");

  stock.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "card";

    const cardImg = document.createElement("img");
    cardImg.className = "card-img-top imagen-producto";
    cardImg.src = producto.imagen;
    card.appendChild(cardImg);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = `${producto.nombre} - ${producto.marca} - ${producto.medida}`;

    const cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = "Precio: " + producto.precio ;

    const agregarButton = document.createElement("button");
    agregarButton.className = "btn btn-primary";
    agregarButton.textContent = "Agregar";
    agregarButton.addEventListener("click", () => {
      agregarProductoCarrito(producto);
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(agregarButton);

    card.appendChild(cardBody);
    container.appendChild(card);
  });
}

function agregarProductoCarrito(producto) {
  const indiceCarrito = carrito.findIndex((item) => {
    return item.producto.nombre == producto.nombre;
  });

  if (indiceCarrito != -1) {
    carrito[indiceCarrito].cantidad++;
  } else {
    const item = new Item(producto, 1);
    carrito.push(item);
  }

  actualizarTablaCarrito();
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Llamamos a la función generarCardsProductos en lugar de popularDropDown
generarCardsProductos();


function actualizarTablaCarrito() {
  tabla.innerHTML = "";
  total.innerText = "0";
  carrito.length || btnVaciar.setAttribute("disabled", true);
  carrito.forEach((item) => {
    newRow(item);
  });
}

function newRow(item) {
  const row = document.createElement("tr"); ///creo la fila
  const posCarrito = carrito.indexOf(item); ///posicion del item en el carrito

  let tdNombre = document.createElement("td");
  tdNombre.classList.add("font-white");
  tdNombre.textContent = item.producto.nombre;
  row.appendChild(tdNombre);

  let tdMarca = document.createElement("td");
  tdMarca.classList.add("font-white");
  tdMarca.textContent = item.producto.marca;
  row.appendChild(tdMarca);

  let tdMedida = document.createElement("td");
  tdMedida.classList.add("font-white");
  tdMedida.textContent = item.producto.medida;
  row.appendChild(tdMedida);

  let tdCantidad = document.createElement("td");
  tdCantidad.classList.add("font-white");
  tdCantidad.textContent = item.cantidad;
  row.appendChild(tdCantidad);

  let tdPrecio = document.createElement("td");
  tdPrecio.classList.add("font-white");
  tdPrecio.textContent = item.producto.precio;
  row.appendChild(tdPrecio);

  let tdsubtotal = document.createElement("td");
  tdsubtotal.classList.add("font-white");
  tdsubtotal.textContent = subtotal(item.producto.precio, item.cantidad);
  row.appendChild(tdsubtotal);

  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn btn-danger";
  btnEliminar.textContent = "Eliminar";

  btnEliminar.onclick = () => {
    carrito.splice(posCarrito, 1); //posicion y cantidad de elementos
    actualizarTablaCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
  };

  td = document.createElement("td");
  td.appendChild(btnEliminar);
  row.appendChild(td);
  tabla.appendChild(row); ///le agrego al tbody una nueva fila
  btnVaciar.removeAttribute("disabled");

  ///calculo el total que tengo ahora

  total.innerText = carrito.reduce(
    (acumulador, item) => acumulador + item.producto.precio * item.cantidad,
    0
  );
}

function vaciarCarrito() {
  Swal.fire({
    title: "Desea eliminar los items del carrito?",
    confirmButtonText: "Si",
    showCancelButton: true,
    cancelButtonText: "No",
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      carrito = [];
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarTablaCarrito();
      Swal.fire({
        title: "Carrito vaciado!",
        icon: "success",
      });
    }
  });
}

btnOrdenar.addEventListener("click", comprarProductos);

function comprarProductos() {
  if (carrito.length > 0) {
    Swal.fire({
      title: "Confirmar compra",
      text: "¿Estás seguro de que deseas realizar la compra?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        solicitarDatosTarjeta();
      }
    });
  } else {
    Swal.fire({
      title: "Carrito vacío",
      text: "No hay productos en el carrito para realizar la compra.",
      icon: "info",
      confirmButtonText: "Aceptar",
    });
  }
}

function solicitarDatosTarjeta() {
  Swal.fire({
    title: "Ingrese los datos de la tarjeta",
    html:
      '<input id="swal-input0" class="swal2-input" placeholder="Nombre y Apellido" required pattern="[A-Za-z ]+">' +
      '<input id="swal-input1" class="swal2-input" placeholder="Número de tarjeta" pattern="[0-9]{16}" maxlength="16" inputmode="numeric">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Fecha de vencimiento (MM/AA)" required pattern="^(0[1-9]|1[0-2])/(2[3-9]|[3-9][0-9])$" maxlength="5">' +
      '<input id="swal-input3" class="swal2-input" placeholder="Código de seguridad" pattern="[0-9]{3,4}" minlength="3" maxlength="4" inputmode="numeric">' +
      '<input id="swal-input4" class="swal2-input" placeholder="Correo electrónico" type="email">',
    showCancelButton: true,
    confirmButtonText: "Comprar",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    preConfirm: () => {
      const nombreApellido = document
        .getElementById("swal-input0")
        .value.trim(); // Eliminar espacios en blanco al inicio y al final
      const numeroTarjeta = document
        .getElementById("swal-input1")
        .value.replace(/ /g, ""); // Remover espacios en blanco
      const vencimiento = document.getElementById("swal-input2").value;
      const codigoSeguridad = document.getElementById("swal-input3").value;
      const correoElectronico = document.getElementById("swal-input4").value;

      if (
        nombreApellido === "" ||
        numeroTarjeta.length !== 16 ||
        vencimiento.length !== 5 ||
        !validarFormatoFecha(vencimiento) ||
        (codigoSeguridad.length !== 3 && codigoSeguridad.length !== 4) ||
        !validarFormatoCorreo(correoElectronico)
      ) {
        Swal.showValidationMessage(
          "Por favor, complete todos los campos correctamente"
        );
        return false;
      }

      return {
        nombre: nombreApellido,
        numero: numeroTarjeta,
        vencimiento: vencimiento,
        codigo: codigoSeguridad,
        correo: correoElectronico,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const datosTarjeta = result.value;
      realizarCompra(datosTarjeta);
    }
  });

  // Validar entrada numérica para el campo "Número de tarjeta"
  document.getElementById("swal-input1").addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/\D/g, ""); // Remover caracteres no numéricos
  });

  // Validar entrada numérica para el campo "Código de seguridad"
  document.getElementById("swal-input3").addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/\D/g, ""); // Remover caracteres no numéricos
  });
}

function validarFormatoCorreo(correo) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(correo);
}

function realizarCompra(datosTarjeta) {
  const numOrden = generarNumeroOrden();
  const correoElectronico = datosTarjeta.correo;

  const promesa = new Promise((resolve) => {
    Swal.fire({
      title: "¡Compra realizada!",
      html: `Gracias por tu compra.<br>Te estaremos enviando la información de tu compra a: <strong>${correoElectronico}</strong>.<br>Número de orden: <strong>${numOrden}</strong>`,
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      setTimeout(() => {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarTablaCarrito();
        resolve();
      }, 1500);
    });
  });

  return promesa;
}

function generarNumeroOrden() {
  return Math.floor(Math.random() * 1000000) + 1;
}

function validarFormatoFecha(fecha) {
  const pattern = /^(0[1-9]|1[0-2])\/(2[3-9]|[3-9][0-9])$/;
  return pattern.test(fecha);
}
