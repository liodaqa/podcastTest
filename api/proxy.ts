export default async function handler(req, res) {
  const response = await fetch(`https://itunes.apple.com${req.query.endpoint}`);
  const data = await response.json();
  res.status(200).json(data);
}
