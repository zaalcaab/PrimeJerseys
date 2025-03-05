// Variable para controlar el cooldown del envío (60 segundos)
let cooldown = false;

// 1) Leemos datos de localStorage
const nombreProducto = localStorage.getItem('productoNombre');
const precioBase = localStorage.getItem('productoPrecio');

// 2) Mostramos la info de la camiseta
const productoInfoDiv = document.getElementById('productoInfo');
productoInfoDiv.innerHTML = `
  <h2>${nombreProducto}</h2>
  <p>Precio base: ${precioBase} €</p>
`;

// 3) Al enviar el formulario, calculamos precio, generamos link de PayPal, enviamos email y controlamos el cooldown
document.getElementById('personalizarForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Comprobar el cooldown
    if (cooldown) {
      alert('Por favor, espera 60 segundos antes de enviar otro pedido.');
      return;
    }
    // Activar cooldown por 60 segundos
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 60000);

    const idPedido = generarIDPedido();

    const nombrePers = document.getElementById('nombrePersonalizado').value.trim();
    const numeroPers = document.getElementById('numeroPersonalizado').value.trim();

    const nombreReceptor = document.getElementById('nombreReceptor').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const ciudad = document.getElementById('ciudad').value.trim();
    const comunidad = document.getElementById('comunidad').value.trim();
    const pais = document.getElementById('pais').value.trim();
    const codigoPostal = document.getElementById('codigoPostal').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const notas = document.getElementById('notas').value.trim();

    if (!nombreReceptor || !direccion || !ciudad || !comunidad || !pais || !codigoPostal || !telefono) {
        alert("Por favor, complete todos los campos de envío.");
        return;
    }

    // Calcular el precio final (añadiendo 1.5€ por cada personalización si se rellenan)
    let precioFinal = parseFloat(precioBase.replace(',', '.'));
    if (nombrePers !== '') precioFinal += 1.5;
    if (numeroPers !== '') precioFinal += 1.5;

    // Generar link de PayPal
    const linkPago = `https://paypal.me/primejerseys/${precioFinal}`;

    // Mostrar detalles y enlace de pago
    const pagoInfoDiv = document.getElementById('pagoInfo');
    pagoInfoDiv.style.display = 'block';
    pagoInfoDiv.innerHTML = `
        <h3>Enlace de pago:</h3>
        <a href="${linkPago}" target="_blank">Pagar ${precioFinal.toFixed(2).replace('.', ',')}€</a>
        <h4>Detalles del pedido:</h4>
        <h3>Tu número de pedido: ${idPedido}</h3>
        <p><strong>Producto:</strong> ${nombreProducto}</p>
        <p><strong>Personalización:</strong> ${nombrePers || 'Sin nombre'}, ${numeroPers || 'Sin número'}</p>
        ${notas ? `<p><strong>Notas:</strong> ${notas}</p>` : ''}
        <h4>Datos de envío:</h4>
        <p><strong>Nombre:</strong> ${nombreReceptor}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Ciudad:</strong> ${ciudad}</p>
        <p><strong>Comunidad Autónoma:</strong> ${comunidad}</p>
        <p><strong>País:</strong> ${pais}</p>
        <p><strong>Código Postal:</strong> ${codigoPostal}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><em>Por favor, copia estos detalles en la nota de PayPal y pégalos.</em></p>
    `;

    // Preparar datos para enviar el correo a través de EmailJS
    const templateParams = {
      order_id: idPedido,
      product_name: nombreProducto,
      base_price: precioBase,
      personalized_name: nombrePers || 'Sin nombre',
      personalized_number: numeroPers || 'Sin número',
      shipping_name: nombreReceptor,
      shipping_address: direccion,
      shipping_city: ciudad,
      shipping_community: comunidad,
      shipping_country: pais,
      shipping_postal: codigoPostal,
      shipping_phone: telefono,
      notes: notas,
      final_price: precioFinal.toFixed(2).replace('.', ',')
    };

    // Enviar el correo con EmailJS
    emailjs.send('gmail', 'pedidos', templateParams)
      .then(function(response) {
          console.log('Correo enviado exitosamente!', response.status, response.text);
      }, function(error) {
          console.error('Error al enviar correo:', error);
      });
});

function generarIDPedido() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `ORD-${timestamp}-${randomStr.toUpperCase()}`;
}

