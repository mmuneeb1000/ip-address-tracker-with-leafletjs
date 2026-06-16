import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

function isValidIP(ip) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
}

app.get("/api/ip-tracker", async (req, res) => {
  try {
    const ip =
      req.query.ipAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const geoRes = await fetch(GEO_API_URL);

    if (!geoRes.ok) {
      throw new Error("Geo lookup failed");
    }

    const geoData = await geoRes.json();

    return res.json({
      ip,
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
    res.status(500).json({ error: "Server crashed while fetching IP data" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
