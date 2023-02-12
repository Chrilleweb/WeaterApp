const api = {
    key: "6e528e920bf5d10e4cb457ec406c742d",
    base: "https://api.openweathermap.org/data/2.5/"
}

const notificationEl = document.querySelector('.notification');
const searchBox = document.querySelector('.search-box');
const searchField = document.querySelector('.search-field');
const suggestions = document.querySelector('.suggestions');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weatherImages = {
    rain: 'https://brownsvilleradio.com/wp-content/uploads/2017/08/heavy-rainfall-sky.jpg',
    sunny: 'https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/325918_2200-1200x628.jpg',
    clouds: 'https://t3.ftcdn.net/jpg/03/50/73/14/360_F_350731454_3WcZ5ng9Lyj6qkMAq7qwdoHjgF6s8Oe2.jpg',
    haze: 'https://cdn-free-legacy.tv2i.dk/2015/12/23/20151223-143506-2_0.jpg?rect=0%2C368%2C4096%2C2301&w=624&h=351&fit=crop&auto=format',
    mist: 'https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/weather/fog--mist/foggy-morning-in-a-meadow.jpg',
    snow: 'https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/weather/winter/footprints-in-the-snow.jpg'
};
const current = document.querySelector(".current");


async function getWeather(city) {
    try {
        const queryURL = `${api.base}weather?q=${city}&units=metric&APPID=${api.key}`;
        const res = await fetch(queryURL);
        console.log("res: ", res);
        const weather = await res.json();
        console.log("weather: ", weather);
        displayResults(weather);
    } catch(err) {
        showError(err);
    }
}

async function searchCities(searchTerm) {
    try {
        const queryURL = `https://api.openweathermap.org/data/2.5/find?q=${searchTerm}&type=like&sort=population&cnt=30&appid=${api.key}`;
        const res = await fetch(queryURL);
        const cities = await res.json();
        console.log(cities);
        return cities;
    } catch(err) {
        console.error(err);
        return [];
    }
}


searchBox.addEventListener('input', async function() {
    const searchTerm = this.value;
    const cities = await searchCities(searchTerm);
    suggestions.innerHTML = '';
    if (cities.list.length > 0) {
        cities.list.forEach(city => {
            const suggestion = document.createElement('div');
            suggestion.innerText = `${city.name}, ${city.sys.country}`;
            suggestion.addEventListener('click', () => {
                getWeather(`${city.name}, ${city.sys.country}`);
                suggestions.innerHTML = '';
                searchBox.value = '';
            });
            suggestions.appendChild(suggestion);
        });
    } else {
        const noResult = document.createElement('div');
        noResult.innerText = 'No results';
        suggestions.appendChild(noResult);
    }
});

searchBox.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        if (suggestions.firstElementChild.innerText !== "No results") {
            suggestions.innerHTML = '';
        }
    }
});





searchBox.addEventListener('keypress', setQuery);

function setQuery(e) {
    if(e.keyCode == 13) {
        getWeather(searchBox.value);
    }
}


function displayResults(weather) {
    const city = document.getElementById("city");
    city.innerText = `${weather.name}, ${weather.sys.country ? weather.sys.country : '' }`;
    const nowDate = new Date();
    const date = document.getElementById("date");
    date.innerText = createDate(nowDate);
    const temp = document.getElementById("temp");
    temp.innerHTML = `${Math.round(weather.main.temp)} <span>°c</span>`;
    const weatherEl = document.getElementById("weatherInSky");
    weatherEl.innerText = `${weather.weather[0].main}`;
    const hilow = document.getElementById("hilow");
    hilow.innerText = `${Math.round(weather.main.temp_max) + "°c"} / ${Math.round(weather.main.temp_min) + "°c"}`;
    if (weather.weather[0].main === "Rain") {
        current.style.backgroundImage = `url(${weatherImages.rain})`;
    } else if (weather.weather[0].main === "Clear") {
        current.style.backgroundImage = `url(${weatherImages.sunny})`;
    } else if (weather.weather[0].main === "Clouds") {
        current.style.backgroundImage = `url(${weatherImages.clouds})`;
    } else if (weather.weather[0].main === "Drizzle"){
        current.style.backgroundImage = `url(${weatherImages.rain})`;
    } else if (weather.weather[0].main === "Haze"){
        current.style.backgroundImage = `url(${weatherImages.haze})`;
    } else if (weather.weather[0].main === "Mist"){
        current.style.backgroundImage = `url(${weatherImages.mist})`;
    } else if (weather.weather[0].main === "Snow"){
        current.style.backgroundImage = `url(${weatherImages.snow})`;
    }
}


function createDate(date) {
    const day = days[date.getDay()];
    const datee = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}. ${datee}. ${month}. ${year}.`;
}

if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    showError('Browser doesnt support Geolocation, please download normal working browser')
}

function setPosition(position) {
    let { latitude, longitude} = position.coords;
    getWeatherByGeo(latitude, longitude);
}

function showError(error) {

}

async function getWeatherByGeo(latitude, longitude) {
    try {
        const query = `${api.base}/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`;
        const res = await fetch(query);
        console.log("res: ", res);
        const weather = await res.json();
        console.log("weather: ", weather);
        displayResults(weather);
    } catch(err) {
        showError(err);
    }
}

window.addEventListener("load", function() {
    getWeather("Copenhagen");
});

searchField.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredSuggestions = suggestions.filter(function(suggestion) {
        return suggestion.toLowerCase().startsWith(searchTerm);
    });
    suggestionsList.innerHTML = '';
    for (const suggestion of filteredSuggestions) {
        const suggestionElement = document.createElement('li');
        suggestionElement.textContent = suggestion;
        suggestionsList.appendChild(suggestionElement);
    }
});
