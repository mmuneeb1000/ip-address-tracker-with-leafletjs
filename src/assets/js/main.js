import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons in Vite
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Initialize map with default view
let map = L.map("map").setView([51.505, -0.09], 13);
let marker = null;

// Add tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Function to update map view
function updateMapView(lat, lng, locationName) {
  map.setView([lat, lng], 13);

  if (marker) {
    map.removeLayer(marker);
  }

  marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup(`<b>${locationName}</b>`).openPopup();
}

// Function to fetch IP data
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

// Function to update UI with IP data
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

// Handle form submission
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

// Load default IP (user's IP) on page load
fetchIPData();

// Basic input validation
searchInput.addEventListener("input", (e) => {
  // Optional: Add real-time validation
  const value = e.target.value.trim();
  if (value === "") {
    searchInput.setCustomValidity("");
  }
});
