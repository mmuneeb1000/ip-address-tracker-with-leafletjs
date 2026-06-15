const ipAddress = document.getElementById("ip-address");
const location = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");

export function updateTrackerCard(data) {
  ipAddress.textContent = data.ip;

  location.textContent = `${data.location.city}, ${data.location.region}`;

  timezone.textContent = `UTC ${data.location.timezone}`;

  isp.textContent = data.isp;
}
