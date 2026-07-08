var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const listEl = document.querySelector('#weather-list');
function fetchWeather() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://api.open-meteo.com/v1/forecast?latitude=7.0620&longitude=38.4763&daily=temperature_2m_max,temperature_2m_min&timezone=auto');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = yield response.json();
            renderWeather(data);
        }
        catch (error) {
            console.error('Failed to fetch weather data:', error);
        }
    });
}
function renderWeather(data) {
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
export {};
//# sourceMappingURL=app.js.map