document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID de la propiedad desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const propiedadId = urlParams.get('propiedad_id');
    const propiedadIdStr = propiedadId.toString();

    // Obtener elementos del DOM
    const propertyTitle = document.querySelector('.property-title');
    const propertyPrice = document.querySelector('.property-price');
    const propertyDescription = document.getElementById('property-description-text');
    const mainImage = document.getElementById('current-image');
    const thumbnailsContainer = document.querySelector('.thumbnail-images');

    // Variables para el modal
    const modal = document.getElementById('image-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const prevModalBtn = document.querySelector('.prev-modal');
    const nextModalBtn = document.querySelector('.next-modal');
    const modalDisplayArea = document.getElementById('modal-display-area');
    const imageBtn = document.getElementById('image-btn');
    const mapBtn = document.getElementById('map-btn');
    const streetViewBtn = document.getElementById('streetview-btn');

    let images = [];
    let currentImageIndex = 0;
    let currentModalMode = 'image'; // 'image', 'map', 'streetview'
    let propiedad; // Almacena los datos de la propiedad

    // Cargar datos de la propiedad desde JSON
    fetch('propiedades.json')
        .then(response => response.json())
        .then(data => {
            propiedad = data[propiedadIdStr];

            if (!propiedad) {
                alert('Propiedad no encontrada');
                return;
            }

            // Actualizar contenido HTML
            propertyTitle.textContent = propiedad.nombre;
            propertyPrice.textContent = propiedad.precio;
            propertyDescription.textContent = propiedad.descripcion;

            images = propiedad.imagenes;
            if (images.length > 0) {
                mainImage.src = images[0];

                images.forEach((imagen, index) => {
                    if (index >= 4) return; // Máximo 5 miniaturas
                    const img = document.createElement('img');
                    img.src = imagen;
                    img.alt = `Imagen ${index + 1}`;
                    img.classList.add('thumbnail');
                    if (index === 0) img.classList.add('active');
                    thumbnailsContainer.appendChild(img);

                    img.addEventListener('click', () => {
                        currentImageIndex = index;
                        openModal();
                    });
                });
            }

            mainImage.addEventListener('click', () => {
                openModal();
            });

            function openModal() {
                modal.style.display = 'flex';
                showImage(); // Por defecto muestra la imagen
            }

            function showImage() {
                currentModalMode = 'image';
                prevModalBtn.style.display = 'block';
                nextModalBtn.style.display = 'block';
                modalDisplayArea.innerHTML = '';
                const img = document.createElement('img');
                img.src = images[currentImageIndex];
                img.alt = 'Imagen Ampliada';
                img.id = 'modal-image';
                modalDisplayArea.appendChild(img);
            }

            function initializeMap() {
                currentModalMode = 'map';
                prevModalBtn.style.display = 'none';
                nextModalBtn.style.display = 'none';
                modalDisplayArea.innerHTML = '';

                const mapContainer = document.createElement('div');
                mapContainer.id = 'map';
                mapContainer.style.width = '100%';
                mapContainer.style.height = '100%';
                modalDisplayArea.appendChild(mapContainer);

                const map = L.map(mapContainer).setView([propiedad.latitud, propiedad.longitud], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                   maxZoom: 19
                }).addTo(map);

                L.marker([propiedad.latitud, propiedad.longitud]).addTo(map)
                  .bindPopup('Ubicación de la propiedad').openPopup();
            }

            function openPanorama() {
                currentModalMode = 'streetview';
                prevModalBtn.style.display = 'none';
                nextModalBtn.style.display = 'none';
                modalDisplayArea.innerHTML = '';

                const panoContainer = document.createElement('div');
                panoContainer.id = 'panorama';
                panoContainer.style.width = '100%';
                panoContainer.style.height = '100%';
                modalDisplayArea.appendChild(panoContainer);

                // Ajusta la ruta de la imagen 360° según tu recurso
                pannellum.viewer('panorama', {
                    type: 'equirectangular',
                    panorama: 'fotos360/casa1_pano.jpg', 
                    autoLoad: true,
                    title: 'Vista 360°',
                    author: 'Inmobiliaria Visión Real'
                });
            }

            // Eventos para los botones del modal
            imageBtn.addEventListener('click', showImage);
            mapBtn.addEventListener('click', initializeMap);
            streetViewBtn.addEventListener('click', openPanorama);

            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    modal.style.display = 'none';
                }

                // Navegación con flechas sólo en modo imagen
                if (modal.style.display === 'flex' && currentModalMode === 'image') {
                    if (event.key === 'ArrowLeft') {
                        prevModalBtn.click();
                    } else if (event.key === 'ArrowRight') {
                        nextModalBtn.click();
                    }
                }
            });

            prevModalBtn.addEventListener('click', () => {
                if (currentModalMode === 'image') {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    showImage();
                }
            });

            nextModalBtn.addEventListener('click', () => {
                if (currentModalMode === 'image') {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    showImage();
                }
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        })
        .catch(error => console.error('Error al cargar la propiedad:', error));
});
