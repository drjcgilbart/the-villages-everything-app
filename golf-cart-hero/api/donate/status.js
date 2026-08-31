export default function handler(_req, res) {
  res.status(200).json({ ready: Boolean(process.env.STRIPE_SECRET_KEY) });
}
