import axios from "axios";

function isIpAddress(value) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
}

export async function fetchLocationData(query = "") {
  const params = {
    apiKey: process.env.at_uCfhVu2DFJaQZs7dqd7RoUorUmjaf,
  };

  if (query) {
    if (isIpAddress(query)) {
      params.ipAddress = query;
    } else {
      params.domain = query;
    }
  }

  const { data } = await axios.get(
    "https://geo.ipify.org/api/v2/country,city",
    { params },
  );

  return data;
}
