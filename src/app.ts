// 1. Define the interface for the Open-Meteo API response shape
interface WeatherResponse {
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}

// 2. Grab DOM elements from index.html
const loadingEl = document.getElementById('loading-state') as HTMLDivElement;
const errorEl = document.getElementById('error-state') as HTMLDivElement;
const listEl = document.getElementById('weather-list') as HTMLUListElement;

// 3. Define the async fetch function
async function fetchWeather(): Promise<void> {
    // Show loading state, clear old data/errors
    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    if (listEl) listEl.innerHTML = '';

    // Open-Meteo URL for Hawassa coordinates
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=7.0622&longitude=38.4784&daily=temperature_2m_max,temperature_2m_min&timezone=auto';

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        // Parse JSON data strictly into our typed shape
        const data: WeatherResponse = await response.json();

        // Hide loading state
        if (loadingEl) loadingEl.style.display = 'none';

        // Render the list using .map()
        renderWeatherList(data);

    } catch (error: unknown) {
        // Hide loading state
        if (loadingEl) loadingEl.style.display = 'none';
        
        // Handle error case visually
        if (errorEl) {
            errorEl.style.display = 'block';
            if (error instanceof Error) {
                errorEl.textContent = `Failed to load weather: ${error.message}`;
            } else {
                errorEl.textContent = 'An unexpected error occurred.';
            }
        }
    }
}

// 4. Render helper using modern JS array operations (.map)
function renderWeatherList(data: WeatherResponse): void {
    if (!listEl) return;

    // Use .map() to create an array of HTML string templates from our data arrays
    const listItems: string[] = data.daily.time.map((dateString, index) => {
        const maxTemp = data.daily.temperature_2m_max[index];
        const minTemp = data.daily.temperature_2m_min[index];
        
        return `
            <li>
                <strong>Date:</strong> ${dateString} | 
                <strong>Max Temp:</strong> ${maxTemp}°C | 
                <strong>Min Temp:</strong> ${minTemp}°C
            </li>
        `;
    });

    // Join the string array together and drop it into the <ul> container
    listEl.innerHTML = listItems.join('');
}

// 5. Run the fetch function automatically on page load
fetchWeather();