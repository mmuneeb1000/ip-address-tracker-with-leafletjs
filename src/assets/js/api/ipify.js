import axios from "axios";

export async function getLocationData(query = "") {
  const { data } = await axios.get("/api/location", {
    params: query ? { query } : {},
  });

  if (!data) {
    throw new Error("Empty response from server");
  }

  return data;
}
