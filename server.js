import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function getIPAddress(domainOrIP = "") {
  try {
    let url;

    if (domainOrIP && domainOrIP !== "") {
      const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(domainOrIP);
      if (isIP) {
        return domainOrIP;
      } else {
        throw new Error("Domain to IP conversion requires additional service");
      }
    } else {
      const apiKey = process.env.IPIFY_API_KEY;
      url = apiKey
        ? `https://geo.ipify.org/api/v2/country?apiKey=${apiKey}`
        : "https://api.ipify.org?format=json";

      const response = await axios.get(url);
      return response.data.ip;
    }
  } catch (error) {
    console.error("Error getting IP from ipify:", error.message);
    throw error;
  }
}

async function getGeolocationData(ipAddress) {
  try {
    const url = `https://ipapi.co/${ipAddress}/json/`;
    const response = await axios.get(url);

    if (response.data.error) {
      throw new Error("Geolocation lookup failed");
    }

    return {
      ip: response.data.ip,
      location: {
        city: response.data.city,
        region: response.data.region,
        country: response.data.country_name,
        lat: response.data.latitude,
        lng: response.data.longitude,
        postalCode: response.data.postal,
      },
      timezone: response.data.timezone,
      isp: response.data.org,
    };
  } catch (error) {
    console.error("Error fetching geolocation:", error.message);
    throw error;
  }
}

app.get("/api/ip-tracker", async (req, res) => {
  try {
    const { ipAddress } = req.query;
    let targetIP;

    if (ipAddress && ipAddress !== "") {
      // Check if input is a valid IP format
      const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(ipAddress);
      if (isIP) {
        targetIP = ipAddress;
      } else {
        try {
          const dnsResponse = await axios.get(
            `https://dns.google/resolve?name=${ipAddress}&type=A`,
          );
          if (dnsResponse.data.Answer && dnsResponse.data.Answer.length > 0) {
            targetIP = dnsResponse.data.Answer[0].data;
          } else {
            throw new Error("Domain not found");
          }
        } catch (dnsError) {
          throw new Error("Unable to resolve domain to IP address");
        }
      }
    } else {
      const ipifyUrl = process.env.IPIFY_API_KEY
        ? `https://geo.ipify.org/api/v2/country?apiKey=${process.env.IPIFY_API_KEY}`
        : "https://api.ipify.org?format=json";

      const ipifyResponse = await axios.get(ipifyUrl);
      targetIP = ipifyResponse.data.ip;
    }

    const geoData = await getGeolocationData(targetIP);

    res.json(geoData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to fetch IP information",
    });
  }
});

app.get("/api/my-ip", async (req, res) => {
  try {
    const apiKey = process.env.IPIFY_API_KEY;
    const url = apiKey
      ? `https://geo.ipify.org/api/v2/country?apiKey=${apiKey}`
      : "https://api.ipify.org?format=json";

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to get IP address" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using ipify for IP lookup`);
});
