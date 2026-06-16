import L from "leaflet";
import "leaflet/dist/leaflet.css";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// map init
const map = L.map("map", { zoomControl: false }).setView(
  [24.8607, 67.0011],
  13,
);

let marker = null;

// tiles
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution: "© OpenStreetMap contributors",
    subdomains: "abcd",
    maxZoom: 19,
    minZoom: 1,
  },
).addTo(map);

// API base
const API_URL = import.meta.env.VITE_API_URL;

// map update (mobile optimized)
function updateMapView(lat, lng, locationName) {
  const zoom = window.innerWidth < 768 ? 11 : 13;

  if (window.innerWidth < 768) {
    const point = map.project([lat, lng], zoom);
    point.y -= 120;
    const center = map.unproject(point, zoom);
    map.setView(center, zoom);
  } else {
    map.setView([lat, lng], zoom);
  }

  if (marker) map.removeLayer(marker);

  marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`<b>${locationName}</b>`).openPopup();
}

// fetch IP
async function fetchIPData(ipAddress = "") {
  try {
    let url = `${API_URL}/api/ip-tracker`;

    if (ipAddress) {
      url += `?ipAddress=${encodeURIComponent(ipAddress)}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Request failed");
    }

    const data = await res.json();

    updateUI(data);

    if (data.location?.lat && data.location?.lng) {
      updateMapView(
        data.location.lat,
        data.location.lng,
        `${data.location.city}, ${data.location.country}`,
      );
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// UI update
function updateUI(data) {
  document.getElementById("ip-address").textContent = data.ip || "-";

  const loc = data.location || {};
  document.getElementById("location").textContent =
    `${loc.city || ""}, ${loc.region || ""}, ${loc.country || ""}`.replace(
      /^, |, $/g,
      "",
    ) || "-";

  document.getElementById("timezone").textContent = data.timezone || "-";
  document.getElementById("isp").textContent = data.isp || "-";
}

// form
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const val = document.getElementById("search-input").value.trim();

  if (val) fetchIPData(val);
});

// initial load
fetchIPData();
