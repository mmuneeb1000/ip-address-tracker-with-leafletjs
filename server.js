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
  const formattedData = {
    ip: "8.8.8.8",
    location: {
      city: "Mountain View",
      region: "California",
      country: "United States",
      lat: 37.4056,
      lng: -122.0775,
      postalCode: "94043",
    },
    timezone: "-07:00",
    isp: "Google LLC",
  };

  res.json(formattedData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using ipify for IP lookup`);
});
