import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';

const RaffleThankYouPage: React.FC = () => {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    // Capture PayPal transaction ID from URL query parameter
    if (router.query.tx) {
      setTransactionId(router.query.tx as string);
    }
  }, [router.query]);

  return (
    <Layout
      title="Thank You for Your Raffle Ticket Purchase - THE FUND Gallery"
      description="Your raffle ticket purchase was successful! Thank you for supporting Ferdinand's education."
    >
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-accent-500 to-accent-600 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-serif text-display-md mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-accent-100">
              Your raffle ticket purchase was successful.
            </p>
          </div>
        </div>
      </section>

      {/* Confirmation Details */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="max-w-2xl mx-auto">
            <div className="bg-accent-50 border-2 border-accent-200 rounded-lg p-8 mb-8">
              <h2 className="font-serif text-2xl text-primary-900 mb-6">
                Confirmation Details
              </h2>

              <div className="space-y-4">
                <div className="pb-4 border-b border-accent-200">
                  <p className="text-sm text-primary-600 mb-1">Your Entry is Confirmed</p>
                  <p className="text-lg font-semibold text-primary-900">Raffle Ticket Entered</p>
                </div>

                {transactionId && (
                  <div className="pb-4 border-b border-accent-200">
                    <p className="text-sm text-primary-600 mb-1">PayPal Transaction ID</p>
                    <p className="font-mono text-primary-900 break-all">
                      {transactionId}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-primary-600 mb-1">Status</p>
                  <p className="text-lg font-semibold text-green-600 flex items-center">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                    Payment Received
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white border border-primary-200 rounded-lg p-8 mb-8">
              <h3 className="font-serif text-xl text-primary-900 mb-6">
                What Happens Next?
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-600 text-white font-semibold">
                      1
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">Email Confirmation</h4>
                    <p className="text-primary-600">
                      You'll receive a confirmation email with your raffle ticket details and transaction receipt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-600 text-white font-semibold">
                      2
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">Your Ticket is Entered</h4>
                    <p className="text-primary-600">
                      Your ticket number has been registered in the raffle drawing. You have a chance to win this beautiful original artwork!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-600 text-white font-semibold">
                      3
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">Random Drawing</h4>
                    <p className="text-primary-600">
                      When the raffle ends on January 16, 2026, a random winner will be selected from all ticket purchases.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-600 text-white font-semibold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-900 mb-1">Winner Notification</h4>
                    <p className="text-primary-600">
                      If you win, we'll contact you by email. The artwork will be shipped to you with free shipping and a Certificate of Authenticity.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Section */}
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-8 mb-8">
              <h3 className="font-serif text-xl text-primary-900 mb-4">
                Your Impact
              </h3>
              <p className="text-primary-700">
                Every ticket purchase directly supports Ferdinand's aviation education dreams. A portion of your purchase helps fund his pathway to becoming a pilot.
              </p>
            </div>

            {/* Call to Action */}
            <div className="space-y-4 mb-8">
              <Link href="/raffles" className="w-full block text-center bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                Back to Raffles
              </Link>
              <Link href="/" className="w-full block text-center bg-primary-100 hover:bg-primary-200 text-primary-600 py-3 px-6 rounded-lg font-semibold transition-colors">
                Return to Gallery
              </Link>
            </div>

            {/* FAQ Section */}
            <div className="border-t border-primary-200 pt-8">
              <h3 className="font-serif text-lg text-primary-900 mb-4">
                Questions?
              </h3>
              <div className="space-y-4 text-sm text-primary-700">
                <p>
                  <strong>What's my ticket number?</strong> Your ticket number has been sent to your email address along with your receipt.
                </p>
                <p>
                  <strong>Can I buy more tickets?</strong> Yes! You can purchase as many tickets as you'd like. Please understand this caveat though: Each individual/person is allowed a maximum of 25 entries in the raffle regardless of how many tickets they purchase. This means that if you purchase more than 25 tickets, you will only receive a maximum of 25 entries and all funds received by the vendor for tickets purchased in excess thereof shall be considered/accepted as a donation to the THE FUND Gallery in support of the Artist, Ferdinand Ssekyanja, its mission and FQMH.
                </p>
                <p>
                  <strong>How will I know if I won?</strong> We'll contact you by email with the winner announcement. Winners will be selected randomly and transparently.
                </p>
                <p>
                  <strong>Is my payment secure?</strong> Your payment was processed securely through PayPal. We never store your full payment details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RaffleThankYouPage;
