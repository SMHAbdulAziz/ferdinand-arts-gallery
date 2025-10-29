import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PayPalRaffleCheckout from '../components/PayPalRaffleCheckout';

export default function RafflePage() {
  const router = useRouter();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = (order) => {
    console.log('Payment successful:', order);
    setPaymentSuccess(true);
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      router.push('/success?payment=paypal&order=' + order.id);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
          <p className="text-green-600">You're entered in the raffle. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Enter Raffle - The FUND Gallery</title>
        <meta name="description" content="Enter the raffle for Ferdinand's 'Playful Giraffe' artwork" />
      </Head>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enter Raffle: "Playful Giraffe"
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              By Ferdinand Ssekyanja
            </p>
            <p className="text-lg text-gray-500">
              Support young artists • Advance the Kingdom • Win beautiful art
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Artwork Details */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                <div className="flex items-center justify-center text-gray-400">
                  <span className="text-sm">Playful Giraffe Image</span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Artwork</h2>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold">Artist:</span>
                    <span>Ferdinand Ssekyanja</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Medium:</span>
                    <span>Acrylic on Canvas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Style:</span>
                    <span>Contemporary African-inspired</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Includes:</span>
                    <span>Certificate of Authenticity</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>Ministry Impact:</strong> 10% of your ticket purchase supports 
                    the FUNDamental Qahal of the Most High's mission to spread good tidings.
                  </p>
                </div>
              </div>
            </div>

            {/* PayPal Checkout */}
            <div>
              <PayPalRaffleCheckout 
                ticketPrice={25}
                onSuccess={handlePaymentSuccess}
              />
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>✅ Secure payment processing with PayPal</p>
                <p>✅ Instant raffle entry confirmation</p>
                <p>✅ Support young artists and ministry work</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Purchase Ticket</h3>
                <p className="text-sm text-gray-600">Secure PayPal checkout for $25</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Get Confirmation</h3>
                <p className="text-sm text-gray-600">Instant email confirmation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Raffle Drawing</h3>
                <p className="text-sm text-gray-600">Fair random selection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Winner Notified</h3>
                <p className="text-sm text-gray-600">Free shipping included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}