import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());

app.get("/api/ip-tracker", async (req, res) => {
  try {
    const ip =
      req.query.ipAddress ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const cleanIP = ip?.replace("::ffff:", "");

    const response = await axios.get(`https://ipwho.is/${cleanIP || ""}`);

    const data = response.data;

    if (!data.success) {
      throw new Error("IP lookup failed");
    }

    res.json({
      ip: cleanIP,
      location: {
        lat: data.latitude,
        lng: data.longitude,
        city: data.city,
        country: data.country,
        region: data.region,
      },
      isp: data.connection?.isp || "Unknown",
      timezone: data.timezone?.id || "Unknown",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server crashed while fetching IP data",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
