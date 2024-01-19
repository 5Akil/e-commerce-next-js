import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
const stripe = require('stripe')("sk_test_51O5nxNIYYpj5fzgm4PajPvJkw7Ep1Ebknew6wSpMseXdaMKnsS8cJpugkrykgFleKS9OZFrH96tDMrMavwXs0nmV00uuMvzEdr");

export default async function handler(req, res) {
  console.log(req.method, '<======req');
  console.log(req.body);
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  }

  try {
    const {
      name, email, city,
      postalCode, streetAddress, country,
      cartProducts,
    } = req.body;
    await mongooseConnect();
    const productsIds = cartProducts;
    let line_items = [];
    for (const productId of cartProducts) {
      const productInfo = await Product.findOne({id:productId});
      const quantity = productsIds.filter(id => id === productId)?.length || 0;
      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: 'USD',
            product_data: { name: productInfo.title },
            unit_amount: quantity * productInfo.price * 100,
          },
        });
      }
    }
    const orderDoc = await Order.create({
      line_items, name, email, city, postalCode,
      streetAddress, country, paid: false,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      payment_intent_data: {
        transfer_data: {
          destination: 'acct_1O5oJHI3Jke2j9vr', // Replace with the connected account's ID
          amount: 1, // Replace with the amount to transfer in cents
        }
      },
      customer_email: email,
      success_url: "http://localhost:3000" + '/cart?success=1',
      cancel_url: "http://localhost:3000" + '/cart?canceled=1',
      metadata: { orderId: orderDoc._id.toString(), test: 'ok' },
    });
    res.json({
      url: session.url,
    })
  } catch (error) {
    console.log(error);
  }

}