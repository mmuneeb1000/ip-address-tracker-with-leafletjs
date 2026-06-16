import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

// simple IP validator
function isValidIP(ip) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
}

// MAIN ROUTE
app.get("/api/ip-tracker", async (req, res) => {
  try {
    const { ipAddress } = req.query;

    let targetIP = ipAddress;

    // if no IP provided → get user's IP
    if (!targetIP) {
      const ipRes = await axios.get("https://api.ipify.org?format=json");
      targetIP = ipRes.data.ip;
    }

    // optional validation
    if (!isValidIP(targetIP)) {
      return res.status(400).json({ error: "Invalid IP address" });
    }

    // geolocation
    const geoRes = await axios.get(`https://ipapi.co/${targetIP}/json/`);
    const g = geoRes.data;

    if (!g || g.error) {
      return res.status(400).json({ error: "Geolocation failed" });
    }

    const formatted = {
      ip: g.ip,
      location: {
        city: g.city || "-",
        region: g.region || "-",
        country: g.country_name || "-",
        lat: g.latitude,
        lng: g.longitude,
        postalCode: g.postal || "-",
      },
      timezone: g.timezone || "-",
      isp: g.org || "-",
    };

    res.json(formatted);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      error: "Server failed to fetch IP data",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
