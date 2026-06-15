import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const response = await axios.get("/api/test");

console.log(response.data);
import express from "express";

const app = express();

app.get("/api/test", (req, res) => {
  res.json({ message: "Server working" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
const map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);
