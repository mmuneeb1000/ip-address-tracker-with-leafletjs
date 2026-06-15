import { fetchLocationData } from "../services/ipifyService.js";

export async function getLocation(req, res) {
  try {
    const query = req.query.query || "";

    const data = await fetchLocationData(query);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch location data",
    });
  }
}
