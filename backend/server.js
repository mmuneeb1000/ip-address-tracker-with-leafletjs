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
    let { ipAddress } = req.query;

    if (!ipAddress) {
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      ipAddress = ipRes.data.ip;
    }

    if (!isValidIP(ipAddress)) {
      return res.status(400).json({ error: "Invalid IP address" });
    }

    const geoRes = await axios.get(`https://ipapi.co/${ipAddress}/json/`);

    const g = geoRes.data;

    if (!g || g.error) {
      return res.status(400).json({ error: "Geolocation failed" });
    }

    res.json({
      ip: g.ip,
      location: {
        city: g.city,
        region: g.region,
        country: g.country_name,
        lat: g.latitude,
        lng: g.longitude,
        postalCode: g.postal,
      },
      timezone: g.timezone,
      isp: g.org,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err.message);

    res.status(500).json({
      error: "Server crashed while fetching IP data",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
