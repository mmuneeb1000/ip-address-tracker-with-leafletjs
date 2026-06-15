export function isIpAddress(value) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(value);
}

export function isDomain(value) {
  return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}
