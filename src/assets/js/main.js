import "../scss/main.scss";

import { getLocationData } from "./api/ipify.js";

import { initMap } from "./components/map.js";

import { initSearchForm } from "./components/search-form.js";

import { updateTrackerCard } from "./components/tracker-card.js";

const mapController = initMap();

async function loadLocation(query = "") {
  try {
    const data = await getLocationData(query);

    updateTrackerCard(data);

    mapController.updateLocation(data.location.lat, data.location.lng);
  } catch (error) {
    console.error(error);
  }
}

initSearchForm(loadLocation);

loadLocation();
