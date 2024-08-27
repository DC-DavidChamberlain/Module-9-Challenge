import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  try {
    // GET weather data from city name
    const weatherData = WeatherService.getWeatherForCity(req.body.cityName);
    // save city to search history
    HistoryService.addCity(req.body.cityName);
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET search history
router.get("/history", async (_req: Request, res: Response) => {
  try {
    const history = HistoryService.getCities();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
