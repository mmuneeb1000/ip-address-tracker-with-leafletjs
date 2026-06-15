export async function getLocation(req, res) {
  try {
    const ip =
      req.query.ip ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.IPIFY_KEY}&ipAddress=${ip}`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.log("IPIFY FAILED:", text);

      return res.status(500).json({
        error: "IPify request failed",
      });
    }

    const data = await response.json();

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
