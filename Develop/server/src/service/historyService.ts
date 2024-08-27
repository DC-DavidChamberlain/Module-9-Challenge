import { promises as fs } from "fs";

class City {
  constructor(
    public id: string,
    public name: string,
  ) {}
}

class HistoryService {
  private filePath = "./searchHistory.json";

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data) as City[];
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, "utf8");
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const newCity: City = { id: Date.now().toString(), name: city };
    cities.push(newCity);
    await this.write(cities);
  }

  // Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter((city) => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
