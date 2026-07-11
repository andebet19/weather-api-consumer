export interface WeatherData {
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
}