import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// POST Request with city name to retrieve weather data
router.post("/", (req: Request, res: Response) => {
  // GET weather data from city name
  getweather(req.body.city);
  // save city to search history
  saveCity(req.body.city);
});

// GET search history
router.get("/history", async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getHistory();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Failed to get search history", error });
  }
});

// * DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await deleteCityFromHistory(id);
    if (result) {
      res.status(200).json({ message: "City deleted from search history" });
    } else {
      res.status(404).json({ message: "City not found in search history" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete city from search history", error });
  }
});

export default router;
