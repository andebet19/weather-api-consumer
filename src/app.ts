import type { WeatherData } from './types.js';

// DOM Elements
const cityTitle = document.getElementById('city-title') as HTMLHeadingElement;
const cityInput = document.getElementById('city-input') as HTMLInputElement;
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
const listEl = document.getElementById('weather-list') as HTMLUListElement;
const loadingState = document.getElementById('loading-state') as HTMLDivElement;
const errorState = document.getElementById('error-state') as HTMLDivElement;

// 1. Fetch coordinates based on a city name (Geocoding)
async function fetchCoordinates(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to find city coordinates.');
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error(`City "${city}" not found. Try another one.`);
        }
        
        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude,
            name: data.results[0].name
        };
    } catch (error: any) {
        showError(error.message);
        return null;
    }
}

// 2. Fetch weather using the coordinates
async function fetchWeather(lat: number, lon: number, cityName: string): Promise<void> {
    showLoading(true);
    showError('');

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Network response was not ok');

        const data: WeatherData = await response.json();
        
        // Update Title and Render Weather list cleanly
        cityTitle.textContent = `${cityName} Weekly Weather`;
        renderWeather(data);
    } catch (error: any) {
        showError('Failed to fetch weather data. Please try again.');
    } finally {
        showLoading(false);
    }
}

// 3. Render Weather list safely using textContent & createElement
function renderWeather(data: WeatherData): void {
    listEl.textContent = ''; 

    data.daily.time.forEach((dateString, index) => {
        const maxTemp = data.daily.temperature_2m_max[index];
        const minTemp = data.daily.temperature_2m_min[index];

        const li = document.createElement('li');
        li.textContent = `Date: ${dateString} | Max Temp: ${maxTemp}°C | Min Temp: ${minTemp}°C`;
        
        listEl.appendChild(li);
    });
}

// Helper UI functions
function showLoading(isLoading: boolean): void {
    loadingState.style.display = isLoading ? 'block' : 'none';
}

function showError(message: string): void {
    if (message) {
        errorState.textContent = message;
        errorState.style.display = 'block';
    } else {
        errorState.style.display = 'none';
    }
}

// Handle Search Event
async function handleSearch(): Promise<void> {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    showLoading(true);
    const location = await fetchCoordinates(cityName);
    
    if (location) {
        await fetchWeather(location.lat, location.lon, location.name);
    } else {
        showLoading(false);
    }
}

// Attach Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Load a default city (Hawassa) on startup
fetchWeather(7.0620, 38.4764, 'Hawassa');