import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/ip-tracker", async (req, res) => {
  try {
    const ip =
      req.query.ipAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const cleanIP = ip?.replace("::ffff:", "");

    const geoRes = await axios.get(`${process.env.GEO_API_URL}?ip=${cleanIP}`);

    const geoData = geoRes.data;

    res.json({
      ip: cleanIP,
      location: {
        lat: geoData.lat,
        lng: geoData.lng,
        city: geoData.city,
        country: geoData.country,
      },
      isp: geoData.isp,
      timezone: geoData.timezone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server crashed while fetching IP data",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Running on", PORT));
