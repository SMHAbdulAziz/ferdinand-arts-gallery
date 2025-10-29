import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from 'react';

export default function PayPalRaffleCheckout({ ticketPrice = 25, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: ticketPrice.toString(),
            currency_code: "USD"
          },
          description: "The FUND Gallery - Raffle Ticket",
          custom_id: `raffle_${Date.now()}`,
        },
      ],
      application_context: {
        brand_name: "The FUND Gallery",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: "https://thefundgallery.org/success",
        cancel_url: "https://thefundgallery.org/cancel"
      }
    });
  };

  const onApprove = async (data, actions) => {
    setLoading(true);
    try {
      const order = await actions.order.capture();
      
      // Send to your backend to record the raffle entry
      const response = await fetch('/api/raffle/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          payerId: order.payer.payer_id,
          amount: order.purchase_units[0].amount.value,
          email: order.payer.email_address,
          name: order.payer.name.given_name + ' ' + order.payer.name.surname,
        })
      });

      if (response.ok) {
        onSuccess && onSuccess(order);
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <PayPalScriptProvider options={initialOptions}>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Purchase Raffle Ticket</h3>
          <div className="mb-4">
            <p className="text-gray-600">Ticket Price: <span className="font-bold">${ticketPrice}</span></p>
            <p className="text-sm text-gray-500">Includes 10% donation to FQMH ministry</p>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing payment...</p>
            </div>
          ) : (
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
              onError={(err) => {
                console.error('PayPal Checkout onError', err);
              }}
              style={{
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "paypal"
              }}
            />
          )}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}