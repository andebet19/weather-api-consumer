import type { WeatherData } from './types';

const listEl = document.querySelector('#weather-list') as HTMLUListElement;

async function fetchWeather(): Promise<void> {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=7.0620&longitude=38.4763&daily=temperature_2m_max,temperature_2m_min&timezone=auto');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: WeatherData = await response.json();
        renderWeather(data);
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
    }
}

function renderWeather(data: WeatherData): void {
    // Clear old list items securely to fix the review feedback
    listEl.textContent = ''; 

    // Loop and build list elements securely without innerHTML
    data.daily.time.forEach((dateString, index) => {
        const maxTemp = data.daily.temperature_2m_max[index];
        const minTemp = data.daily.temperature_2m_min[index];

        const li = document.createElement('li');
        li.textContent = `Date: ${dateString} | Max Temp: ${maxTemp}°C | Min Temp: ${minTemp}°C`;
        
        listEl.appendChild(li);
    });
}

fetchWeather();