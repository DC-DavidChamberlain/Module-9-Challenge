import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Define a class for the Weather object
class Weather {
  temperature: number;
  wind: number;
  humidity: number;
  icon: string;

  constructor(
    temperature: number,
    wind: number,
    humidity: number,
    icon: string,
  ) {
    this.temperature = temperature;
    this.wind = wind;
    this.humidity = humidity;
    this.icon = icon;
  }
}

// Complete the WeatherService class
class WeatherService {
  // Define the baseURL and API key properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string = "";

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(
      `${this.baseURL}/geocode?query=${query}&apiKey=${this.apiKey}`,
    );
    return response.json();
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData;
    return { latitude: lat, longitude: lon };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geocode?city=${this.cityName}&apiKey=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&apiKey=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData: any = await response.json();

    // Parse current weather
    const currentWeather = this.parseCurrentWeather(weatherData);

    // Build forecast array
    const forecastArray = this.buildForecastArray(weatherData.list as any[]);

    return { currentWeather, forecastArray };
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { temp } = response.main;
    const { speed: wind } = response.wind;
    const { humidity } = response.main;
    const { icon } = response.weather[0];
    return new Weather(temp, wind, humidity, icon);
  }

  // Complete buildForecastArray method
  private buildForecastArray(weatherData: any[] | unknown[]): Weather[] {
    return (weatherData as any[]).map((data) => {
      const { temp } = data.main;
      const { speed: wind } = data.wind;
      const { humidity } = data.main;
      const { icon } = data.weather[0];
      return new Weather(temp, wind, humidity, icon);
    });
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ forecastArray: Weather[] }> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    console.log(coordinates);
    const weatherData = await this.fetchWeatherData(coordinates);
    console.log(weatherData);
    return weatherData;
  }
}

const baseURL = process.env.API_BASE_URL || "";
const apiKey = process.env.API_KEY || "";
export default new WeatherService(baseURL, apiKey);
