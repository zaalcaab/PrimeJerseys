function cargarCamisetas(jsonPath) {
    fetch(jsonPath)
    .then(response => response.json())
    .then(data => {
        const contenedor = document.getElementById('productos');
        
  data.forEach(camiseta => {
    // Crea la tarjeta de producto
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');
    productoDiv.innerHTML = `
      <img src="${camiseta.imagen}" alt="${camiseta.nombre}">
      <h3>${camiseta.nombre}</h3>
      <p>Año: ${camiseta.año}</p>
      <p>Equipación: ${camiseta.equipacion}</p>
      <p>Precio: ${camiseta.precio}€</p>
      <button>Añadir al carrito</button>
    `;
    contenedor.appendChild(productoDiv);
  });
})
.catch(error => console.error('Error al cargar las camisetas:', error));
}
