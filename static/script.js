let soymano = true

// Cartas callendo 

// Seleccionar el contenedor de la lluvia de cartas
const rainContainer = document.getElementById('rain-container');

// Lista de imágenes de cartas (puedes cambiar las rutas)
const cardImages = [
    '../Img/Carta.png',
    '../Img/Carta2.png',
    '../Img/Carta3.png',
    '../Img/Carta4.png',
    '../Img/Carta5.png',
    '../Img/Carta6.png',
    '../Img/Carta7.png',
    '../Img/Carta8.png',
    '../Img/Carta9.png',
    '../Img/Carta10.png',
];

// Configuración para generar las cartas
const totalCards = 30; // Número total de cartas

// Función para generar y animar las cartas
function createCard() {
    // Crear un nuevo elemento img para cada carta
    const card = document.createElement('img');
    card.src = cardImages[Math.floor(Math.random() * cardImages.length)];
    card.classList.add('card'); // Añadir la clase base

    // Posición aleatoria horizontal
    card.style.left = `${Math.random() * 100}vw`;
    
    // Duración aleatoria de la animación para cada carta (entre 5 y 15 segundos)
    card.style.animationDuration = `${Math.random() * 10 + 5}s`;
    
    // Tamaño aleatorio de la carta (entre 20 y 50px de ancho)
    const size = 4;
    card.style.width = `${size}vh`;

    // Altura aleatoria inicial para que las cartas no comiencen todas en la misma posición
    card.style.top = `${0}vh`;

    // Añadir la carta al contenedor
    rainContainer.appendChild(card);

    // Eliminar la carta después de completar la animación
    card.addEventListener('animationend', () => {
        card.remove();
    });

    // Eliminar la carta después de un tiempo fijo (igual a la duración de la animación)
    setTimeout(() => {
        card.remove();
    }, parseFloat(card.style.animationDuration) * 1000); // Convertir la duración a milisegundos
}

// Generar las cartas al cargar la página
for (let i = 0; i < totalCards; i++) {
    createCard();
}

// Generar nuevas cartas de manera continua (opcional)
setInterval(createCard, 500);

// script.js

document.addEventListener('DOMContentLoaded', () => {
    let inputCounter = 1; // Contador para controlar los inputs dinámicos
    const inputContainersDiv = document.getElementById('input-containers');

    // Crear un nuevo Web Worker
    const worker = new Worker("../static/worker.js");

    // Función para manejar el evento click del botón Enviar
    const handleSendButtonClick = (buttonId, inputId, responseBoxId) => {
        const inputText = document.getElementById(inputId).value.trim();
        const responseDiv = document.getElementById(responseBoxId);

        // Validar el formato del input usando la expresión regular

        let overflow = false
        if (buttonId == 'sendButton-1'){
            const regex = /^([1-7JQK]{0,4})\s([1-7JQK]{0,4})?\s?(true|false)?$/;
            const match = inputText.match(regex);
            if (match) {
                const manoamiga1 = match[1];  // La primera mano
                const manoamiga2 = match[2] || '';  // La segunda mano, opcional
                const soymano = match[3] !== 'false';  // Asumir true si no se proporciona B
                // Validar que no se repitan más de 4 veces los caracteres en total entre las dos manos
                const combined = manoamiga1 + manoamiga2;
                const counts = {};
                let Char = ''

                for (const char of combined) {
                    counts[char] = (counts[char] || 0) + 1;
                    if (counts[char] > 4) {
                        Char=char
                        overflow = true
                        break
                    }
                }
                if (!overflow){
                    // Enviar los datos al Web Worker para el cálculo de probabilidades
                    // Se añade un identificador único al mensaje para rastrear la respuesta
                    worker.postMessage({ type: 'initial', manoamiga1, manoamiga2, soymano, id: responseBoxId, NaN, NaN, NaN });
                    // Mostrar mensaje de espera mientras se realiza el cálculo
                    responseDiv.innerHTML = "Consultando a Musinator...";
                } else{
                    responseDiv.textContent = 'No me caben tantos '+Char
                }
            } else {
                responseDiv.textContent = '¿Uff pero qué me has metido? No Válido. Ejemplo válido: "1214 Q3QK1 true" o "4567 false" (true si sois mano).';
            }
        } else if (buttonId == 'sendButton-2'){
            const regex = /^([1-7JQK]{0,4})\s([1-7JQK]{0,4})?\s?(true|false)?\s?([1-7JQK]*)?\s?([1-7JQK]*)?$/;
            const match = inputText.match(regex);
            if (match) {
                const manoamiga1 = match[1]; // La primera mano
                const manoamiga2 = match[2] || ''; // La segunda mano, opcional
                const soymano = match[3] !== 'false'; // Asumir true si no se proporciona B
                const tiro = match[4] || ''; // Lista de cartas de longitud arbitraria que tiro
                const deseadas = match[5] || ''; // Cartas Deseadas
                

                // Validar que no se repitan más de 4 veces los caracteres en total entre las dos manos y L
                const combined = manoamiga1 + manoamiga2 + tiro;
                const counts = {};

                let Char = ''
                for (const char of combined) {
                    counts[char] = (counts[char] || 0) + 1;
                    if (counts[char] > 4) {
                        Char = char
                        overflow = true
                        break
                    }
                }
                if (!overflow){
                    // Enviar los datos al Web Worker para el cálculo de probabilidades
                    // Se añade un identificador único al mensaje para rastrear la respuesta
                    worker.postMessage({ type: 'sequential', manoamiga1, manoamiga2, soymano, id: responseBoxId, tiro, deseadas });
                    // Mostrar mensaje de espera mientras se realiza el cálculo
                    responseDiv.innerHTML = "Consultando a Musinator...";
                } else{
                    responseDiv.textContent = 'No me caben tantos'+Char
                }
            } else{
                responseDiv.textContent = '¿Uff pero qué me has metido? No Válido. Ejemplo válido: "1214 Q3QK1 (manos después de mus) true 5576J (descarto) K3 (deseadas) " (true si sois mano).';
            }
        }
    };

    // Añadir evento click al primer botón
    document.getElementById(`sendButton-1`).addEventListener('click', () => {
        handleSendButtonClick(`sendButton-1`, `textInput-1`, `response-box-1`);
    });
    if(inputCounter !== 1){
        // Añadir evento click al primer botón
        document.getElementById(`sendButton-${inputCounter}`).addEventListener('click', () => {
            handleSendButtonClick(`sendButton-${inputCounter}`, `textInput-${inputCounter}`, `response-box-${inputCounter}`);
        }); 
    }

    // Recibir la respuesta del Web Worker
    worker.addEventListener('message', (event) => {
        const { id, Probabilidades} = event.data;
        const responseDiv = document.getElementById(id);

        if (responseDiv) {
            // Limpiar el contenido anterior
            responseDiv.innerHTML = '';

            const MisProbabilidades = document.createElement('div')
            responseDiv.appendChild(MisProbabilidades);
            // Mostrar las probabilidades
            const responseMessage = `
                ${Probabilidades[1]} <br>
                Grande: ${Probabilidades[0][0][0]}% <br>
                Chica: ${Probabilidades[0][0][1]}% <br>
                Pares al primero: ${Probabilidades[0][1][0]}% <br>
                Pares al segundo: ${Probabilidades[0][1][1]}% <br>
                Pares a ambos: ${Probabilidades[0][1][2]}% <br>
                Juego al primero: ${Probabilidades[0][2][0]}% <br>
                Juego al segundo: ${Probabilidades[0][2][1]}% <br>
                Juego a ambos: ${Probabilidades[0][2][2]}% <br>
                Al Punto: ${Probabilidades[0][2][3]}% <br>
                Configuraciones posibles: ${Probabilidades[2]}<br>
            `;
            MisProbabilidades.innerHTML = responseMessage;
        }

        if (inputCounter < 2) {
            inputCounter++;
            const newInputHTML = `
                <div class="user-input" id="input-${inputCounter}">
                    <h2>Feeling Lucky</h2>
                    <div class="input-container">
                        <input type="text" class="textInput" id="textInput-${inputCounter}" placeholder="Escriba aquí...">
                        <button class="sendButton" id="sendButton-${inputCounter}">Enviar a Musinator</button>
                    </div>
                    <div id="response-box-${inputCounter}" class="response-box"></div>
                </div>
            `;
            inputContainersDiv.insertAdjacentHTML('beforeend', newInputHTML);
            // Añadir evento click al primer botón
            document.getElementById(`sendButton-${inputCounter}`).addEventListener('click', () => {
                handleSendButtonClick(`sendButton-${inputCounter}`, `textInput-${inputCounter}`, `response-box-${inputCounter}`);
            });
        }
    });
});