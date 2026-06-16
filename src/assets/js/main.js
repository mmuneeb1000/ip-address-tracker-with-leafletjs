import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconShadow: iconShadow,
});

let map = L.map("map", { zoomControl: false }).setView([24.8607, 67.0011], 13);
let marker = null;

L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    maxZoom: 19,
    minZoom: 1,
  },
).addTo(map);

const blackIcon = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <img src="/src/assets/images/icon-location.svg" style="width: 42px; height: 42px;">
  </div>`,
  iconSize: [32, 48],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "custom-marker",
});

function updateMapView(lat, lng, locationName) {
  const zoom = window.innerWidth < 768 ? 11 : 13;

  if (window.innerWidth < 768) {
    const point = map.project([lat, lng], zoom);
    point.y -= 80; // adjust as needed

    const center = map.unproject(point, zoom);
    map.setView(center, zoom);
  } else {
    map.setView([lat, lng], zoom);
  }

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng], { icon: blackIcon }).addTo(map);
  marker.bindPopup(`<b>${locationName}</b>`).openPopup();
}

async function fetchIPData(ipAddress = "") {
  try {
    let url = "/api/ip-tracker";

    if (ipAddress) {
      url += `?ipAddress=${encodeURIComponent(ipAddress)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json();

    updateUI(data);

    if (data.location?.lat && data.location?.lng) {
      const locationString = `${data.location.city}, ${data.location.country}`;
      updateMapView(data.location.lat, data.location.lng, locationString);
    }
  } catch (error) {
    console.error("Error:", error);
    alert(error.message || "Failed to fetch IP information.");
  }
}

function updateUI(data) {
  document.getElementById("ip-address").textContent = data.ip || "-";

  const location = data.location;
  const locationString = location
    ? `${location.city || ""}, ${location.region || ""}, ${location.country || ""}`.replace(
        /^, |, $/g,
        "",
      )
    : "-";
  document.getElementById("location").textContent = locationString || "-";

  document.getElementById("timezone").textContent = data.timezone || "-";
  document.getElementById("isp").textContent = data.isp || "-";
}

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm) {
    await fetchIPData(searchTerm);
  } else {
    alert("Please enter an IP address or domain");
  }
});

fetchIPData();

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim();
  if (value === "") {
    searchInput.setCustomValidity("");
  }
});
