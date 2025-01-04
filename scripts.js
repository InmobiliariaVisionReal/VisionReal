// detalledepropiedad.js

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la propiedad desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const propiedadId = urlParams.get('propiedad_id');

    // Asegurarse de que propiedadId es una cadena, ya que las claves en el JSON son cadenas
    const propiedadIdStr = propiedadId.toString();

    // Obtener elementos del DOM
    const propertyTitle = document.querySelector('.property-title');
    const propertyPrice = document.querySelector('.property-price');
    const propertyLocation = document.querySelector('.property-location');
    const propertyDescription = document.getElementById('property-description-text');
    const mainImage = document.getElementById('current-image');
    const thumbnailsContainer = document.querySelector('.thumbnail-images');

    // Variables para el modal
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.querySelector('.close-modal');
    const prevModalBtn = document.querySelector('.prev-modal');
    const nextModalBtn = document.querySelector('.next-modal');

    let images = [];
    let currentImageIndex = 0;

    // Cargar datos de la propiedad desde el JSON
    fetch('propiedades.json')
        .then(response => response.json())
        .then(data => {
            const propiedad = data[propiedadIdStr];

            if (!propiedad) {
                alert('Propiedad no encontrada');
                return;
            }

            // Actualizar el contenido del HTML con los datos de la propiedad
            propertyTitle.textContent = propiedad.nombre;
            propertyPrice.textContent = propiedad.precio;
            propertyLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${propiedad.ubicacion}`;
            propertyDescription.textContent = propiedad.descripcion;

            // Cargar las imágenes
            images = propiedad.imagenes;

            if (images.length > 0) {
                mainImage.src = images[0];

                images.forEach((imagen, index) => {
                    if (index >= 4) return; // Mostrar solo 4 imágenes en miniaturas

                    const img = document.createElement('img');
                    img.src = imagen;
                    img.alt = `Imagen ${index + 1}`;
                    img.classList.add('thumbnail');
                    if (index === 0) img.classList.add('active');
                    thumbnailsContainer.appendChild(img);

                    // Evento al hacer clic en una miniatura
                    img.addEventListener('click', () => {
                        mainImage.src = imagen;
                        currentImageIndex = index;
                        // Actualizar estado activo
                        document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                        img.classList.add('active');
                        openModal(); // Abrir el modal al hacer clic en la miniatura
                    });
                });
            }


            // Evento para abrir el modal al hacer clic en la imagen principal
            mainImage.addEventListener('click', () => {
                openModal();
            });

            // Función para abrir el modal
            function openModal() {
                modal.style.display = 'block';
                modalImage.src = images[currentImageIndex];
            }

            // Función para cerrar el modal
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // Navegación en el modal
            prevModalBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                modalImage.src = images[currentImageIndex];
            });

            nextModalBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                modalImage.src = images[currentImageIndex];
            });

            // Cerrar el modal al hacer clic fuera de la imagen
            modal.addEventListener('click', (e) => {
                if (e.target == modal) {
                    modal.style.display = 'none';
                }
            });
        })
        .catch(error => console.error('Error al cargar la propiedad:', error));
});
