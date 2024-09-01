const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const itemList = document.getElementById('itemList');
const suggestionBox = document.getElementById('suggestionBox');

const items = [
    { name: "Jharia Coalfield", location: "Jharkhand, Dhanbad", latitude: "23.7973", longitude: "86.4390" },
    { name: "Raniganj Coalfield", location: "West Bengal, Birbhum", latitude: "23.5584", longitude: "87.3196" },
    { name: "Korba Coalfield", location: "Chhattisgarh, Korba", latitude: "22.3488", longitude: "82.6737" },
    { name: "Talcher Coalfield", location: "Odisha, Angul", latitude: "20.6240", longitude: "85.3056" },
    { name: "Bokaro Coalfield", location: "Jharkhand, Bokaro", latitude: "23.7505", longitude: "86.1854" },
    { name: "Karanpura Coalfield", location: "Jharkhand, Ramgarh", latitude: "23.6200", longitude: "85.6800" },
    { name: "Singrauli Coalfield", location: "Madhya Pradesh, Singrauli", latitude: "24.2070", longitude: "82.5921" },
    { name: "Godavari Valley Coalfield", location: "Telangana, Khammam", latitude: "17.6812", longitude: "80.8084" },
    { name: "Wardha Valley Coalfield", location: "Maharashtra, Wardha", latitude: "20.8322", longitude: "79.3802" },
    { name: "Singareni Coalfield", location: "Telangana, Adilabad", latitude: "19.2668", longitude: "78.5440" }
];

const API_KEY = '44048de0265344f39e205146240109'; // Replace with your actual API key
const DEFAULT_LOCATION = 'Greater Noida';

async function getWeather() {
    const location = document.getElementById('location-input').value || DEFAULT_LOCATION;
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=yes`);
        if (!response.ok) throw new Error('Weather data not available');
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

function updateWeatherDisplay(data) {
    // Update current weather
    document.getElementById('current-temp').textContent = `${data.current.temp_c}°C`;
    document.getElementById('current-condition').textContent = data.current.condition.text;
    document.getElementById('location').textContent = data.location.name;
    document.getElementById('last-updated').textContent = `Last Updated: ${data.current.last_updated}`;
    document.getElementById('current-icon').textContent = getWeatherEmoji(data.current.condition.code);

    // Update hourly forecast
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = '';
    data.forecast.forecastday[0].hour.slice(0, 4).forEach(hour => {
        const hourDiv = document.createElement('div');
        hourDiv.className = 'hourly-item';
        hourDiv.innerHTML = `
            <div>${new Date(hour.time).getHours()}:00</div>
            <div>${getWeatherEmoji(hour.condition.code)}</div>
            <div>${hour.temp_c}°</div>
        `;
        hourlyForecast.appendChild(hourDiv);
    });

    // Update daily forecast
    const dailyForecast = document.getElementById('daily-forecast');
    dailyForecast.innerHTML = '';
    data.forecast.forecastday.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'daily-item';
        dayDiv.innerHTML = `
            <span>${new Date(day.date).toLocaleDateString('en-US', {weekday: 'short'})}</span>
            <span>${getWeatherEmoji(day.day.condition.code)}</span>
            <span>${day.day.maxtemp_c}° High</span>
            <span>${day.day.mintemp_c}° Low</span>
        `;
        dailyForecast.appendChild(dayDiv);
    });

    // Update additional info
    document.getElementById('precipitation').textContent = `${data.current.precip_mm} mm`;
    document.getElementById('wind').textContent = `${data.current.wind_kph} kph`;
    document.getElementById('pressure').textContent = `${data.current.pressure_mb} mb`;
    document.getElementById('uv').textContent = data.current.uv;

    // Update pollution (if available)
    const aqi = data.current.air_quality?.['us-epa-index'];
    document.getElementById('pollution').textContent = aqi ? `Pollution Level: ${getAQIDescription(aqi)}` : 'AQI data not available';
}

function getWeatherEmoji(conditionCode) {
    const codeMap = {
        1000: '☀', // Sunny
        1003: '⛅', // Partly cloudy
        1006: '☁', // Cloudy
        1009: '☁', // Overcast
        1030: '🌫', // Mist
        1063: '🌧', // Patchy rain possible
        1186: '🌧', // Moderate rain
        1189: '🌧', // Moderate rain
        1192: '🌧', // Heavy rain
        1273: '🌩', // Patchy light rain with thunder
        1276: '🌩'  // Moderate or heavy rain with thunder
    };
    return codeMap[conditionCode] || '❓';
}

function getAQIDescription(aqi) {
    const aqiMap = {
        1: 'Good',
        2: 'Moderate',
        3: 'Unhealthy for sensitive groups',
        4: 'Unhealthy',
        5: 'Very Unhealthy',
        6: 'Hazardous'
    };
    return aqiMap[aqi] || 'Unknown';
}

// Initial weather fetch
getWeather();

function filterItems(searchTerm) {
    return items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.location.toLowerCase().includes(searchTerm)
    );
}

function updateItemList(filteredItems) {
    itemList.innerHTML = '';
    filteredItems.forEach(item => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.textContent = `${item.name} - ${item.location}`;

        // Set query parameters
        anchor.href = `/mine?name=${encodeURIComponent(item.name)}&location=${encodeURIComponent(item.location)}&latitude=${encodeURIComponent(item.latitude)}&longitude=${encodeURIComponent(item.longitude)}`;

        listItem.appendChild(anchor);
        itemList.appendChild(listItem);
    });
}

function updateSuggestions(searchTerm) {
    const suggestions = filterItems(searchTerm);
    suggestionBox.innerHTML = '';
    if (searchTerm && suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = `${suggestion.name} - ${suggestion.location}`;
            suggestionItem.addEventListener('click', () => {
                searchInput.value = `${suggestion.name} - ${suggestion.location}`;
                updateItemList([suggestion]);
                suggestionBox.innerHTML = '';
            });
            suggestionBox.appendChild(suggestionItem);
        });
        suggestionBox.style.display = 'block';
    } else {
        suggestionBox.style.display = 'none';
    }
}

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    updateSuggestions(searchTerm);
});

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = filterItems(searchTerm);
    updateItemList(filteredItems);
    suggestionBox.innerHTML = '';
});

// Populate the initial list with all items
updateItemList(items);

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3a4fb03958734fe2b73f43614eaab4a0';  // Replace with your NewsAPI key
    const endpoint = `https://newsapi.org/v2/everything?q=pollution%20India&apiKey=${apiKey}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            const articles = data.articles;
            const marquee = document.querySelector('.marquee');
            if (articles.length > 0) {
                // Clear any existing content
                marquee.innerHTML = '';

                // Create and append new <p> elements for each news headline
                articles.slice(0, 5).forEach(article => {
                    const paragraph = document.createElement('p');
                    paragraph.textContent = article.title;
                    marquee.appendChild(paragraph);
                });
            } else {
                marquee.innerHTML = '<p>No news available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
        });
});
