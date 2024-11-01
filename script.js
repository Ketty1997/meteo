
//elementi html
const main = document.querySelector('main');
const locationDiv = document.querySelector('.weather-location');
const temperatureSpan = document.querySelector('.weather-temperature .temp');
const weatherImageDiv = document.querySelector('weather-image');

//entrypoint
getDevicePosition();

function getDevicePosition() {
    //acquisizione posizione del dispositivo
    navigator.geolocation.getCurrentPosition(onPositionAcquired, onPositionError)
}
async function onPositionAcquired(position) {
    console.log('device position acquired', position);
    //  recupero dati meteo
    const weatherData = await getWeatherData(position);
    //generezione immagine
    const imageData = await getImageData(weatherData);
    //rappresentazione dati acquisiti
    displayWeatherData(weatherData);
    displayWeatherImage(imageData);
    //navigazione schemrata di risultato
    main.className = 'result';
}

function onPositionError(error) {
    console.error(error);
    alert('Impossibile acquisire la posizione del dispositivo');
}

async function getWeatherData(position) {
    //estrazione parametri
    const lat = position.cords.latitude;
    const lon = position.cords.longitude;

    //altri parametri richiesta
    const units = 'metric';
    const lang = 'it';
    const key = '';

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}&lang=${lang}`;
    //richiesta
    const res = await fetch(url);
    const data = await res.json();
    //risultato 
    return data;
}

async function getImageData(weatherData) {
    // estrazione parametri richiesta
    const location = weatherData.name;
    const conditions = weatherData.weather[0].description;
    //endpoint,chiave, prompt
    const url = 'https://api.openai.com/v1/images/generations';
    const key = '';

    const prompt = `un'immagine fotorealistica di ${location} con condizioni meteo ${conditions}, che mostra una vista suggestiva di un punto di riferimento della citta dalle strade, con un'illuminazione calda e dorata.`
    //richiesta
    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer${key}`
        },
        method: 'POST',
        body: JSON.stringify({
            model: 'dall-e-3',
            n: 1,
            size: '',
            prompt: prompt,
            response_format: 'b64_json'

        })
    });

    const data = await res.json();
    //risultato richiesta
    return data;
}

function displayWeatherData(weatherData) {
    //estrazione info
    const temp = weatherData.main.temp;
    const location = weatherData.name;
    //inserimento info nell'html
    locationDiv.innerText = location;
    temperatureSpan.innerText = temp;
}

function displayWeatherImage(imageData) {
    //estrazione info
    const b64 = imageData.data[0].b64_json;
    const src = `data:image/png;base64,${b64}`;
    //costruzione html da iniettare
    const img = `<img src="${src}" alt="weather image">`;
    //iniezione
    weatherImageDiv.innerHTML = img;
}


