import L from "leaflet";
import "leaflet/dist/leaflet.css";

export function initMap() {
  const map = L.map("map").setView([0, 0], 2);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  const marker = L.marker([0, 0]).addTo(map);

  return {
    updateLocation(data) {
      const lat = data.location.lat;
      const lng = data.location.lng;

      map.setView([lat, lng], 13);
      marker.setLatLng([lat, lng]);
    },
  };
}
