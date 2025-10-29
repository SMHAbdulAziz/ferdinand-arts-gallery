import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const { payment, order } = router.query;
    if (payment && order) {
      setOrderDetails({ payment, orderId: order });
    }
  }, [router.query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-50">
      <Head>
        <title>Thank You - The FUND Gallery</title>
        <meta name="description" content="Thank you for supporting young artists!" />
      </Head>

      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Support!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              You're now entered in the raffle for Ferdinand's "Playful Giraffe"
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Payment Confirmed</h3>
                  <p className="text-gray-600">Your PayPal payment has been processed successfully.</p>
                  {orderDetails && (
                    <p className="text-sm text-gray-500 mt-1">
                      Order ID: {orderDetails.orderId}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-blue-600 font-bold text-sm">📧</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Confirmation</h3>
                  <p className="text-gray-600">You'll receive a confirmation email with your raffle entry details.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-indigo-600 font-bold text-sm">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Raffle Drawing</h3>
                  <p className="text-gray-600">The winner will be selected randomly when the raffle period ends.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-purple-600 font-bold text-sm">❤️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ministry Impact</h3>
                  <p className="text-gray-600">$2.50 from your purchase supports the FUNDamental Qahal's ministry work.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Return to Gallery
            </Link>
            <div>
              <Link href="/raffle" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Enter Another Raffle →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center text-gray-500">
            <p className="mb-2">Questions? Contact us at info@thefundgallery.org</p>
            <p className="text-sm">Thank you for supporting young artists and advancing the Kingdom!</p>
          </div>
        </div>
      </div>
    </div>
  );
}