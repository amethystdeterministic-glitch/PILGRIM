import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createDonateSession(req, res) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Support Amethyst"
            },
            unit_amount: 500
          },
          quantity: 1
        }
      ],
      success_url: "http://127.0.0.1:9191/?donated=true",
      cancel_url: "http://127.0.0.1:9191/"
    });

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ id: session.id }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
}
