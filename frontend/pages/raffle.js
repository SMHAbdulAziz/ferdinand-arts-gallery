import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import PayPalRaffleCheckout from '../components/PayPalRaffleCheckout';

export default function RafflePage() {
  const router = useRouter();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [raffleData, setRaffleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freeEntryEmail, setFreeEntryEmail] = useState('');
  const [freeEntryLoading, setFreeEntryLoading] = useState(false);
  const [freeEntrySuccess, setFreeEntrySuccess] = useState(false);
  const [countdown, setCountdown] = useState({});

  // Fetch current raffle status
  const fetchRaffleStatus = async () => {
    try {
      const response = await fetch('/api/raffle/status');
      const data = await response.json();
      if (data.success) {
        setRaffleData(data.raffle);
      } else {
        setError(data.error || 'Failed to load raffle data');
      }
    } catch (err) {
      setError('Network error loading raffle data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update countdown timer
  useEffect(() => {
    if (!raffleData) return;

    const updateCountdown = () => {
      const endDate = new Date(raffleData.end_date);
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) {
        setCountdown({ expired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds, expired: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [raffleData]);

  useEffect(() => {
    fetchRaffleStatus();
  }, []);

  const handlePaymentSuccess = async (order) => {
    console.log('Payment successful:', order);
    setPaymentSuccess(true);
    await fetchRaffleStatus();
    setTimeout(() => {
      router.push('/success?payment=paypal&order=' + order.id);
    }, 2000);
  };

  const handleFreeEntry = async (e) => {
    e.preventDefault();
    setFreeEntryLoading(true);

    try {
      const response = await fetch('/api/raffle/free-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raffleId: raffleData.id,
          email: freeEntryEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFreeEntrySuccess(true);
        setFreeEntryEmail('');
        setTimeout(() => setFreeEntrySuccess(false), 5000);
      } else {
        alert(data.error || 'Failed to process free entry');
      }
    } catch (err) {
      alert('Error processing free entry');
      console.error(err);
    } finally {
      setFreeEntryLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading raffle details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Raffle</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchRaffleStatus}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentSuccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
            <p className="text-green-600">You're entered in the raffle. Redirecting...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const raffle = raffleData;

  return (
    <Layout>
      <Head>
        <title>Enter Raffle - The FUND Gallery</title>
        <meta name="description" content={`Enter the raffle for ${raffle?.artwork_title || "Ferdinand's artwork"}`} />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Enter Raffle: "{raffle?.artwork_title || 'Playful Giraffe'}"
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                By {raffle?.artist_name || 'Ferdinand Ssekyanja'}
              </p>
              <p className="text-lg text-gray-500">
                Support young artists • Advance the Kingdom • Win beautiful art
              </p>
            </div>

            {/* PROTOCOL: Mandatory Disclosure Banner */}
            <div className="mb-8 bg-amber-50 border-l-4 border-amber-400 p-6 rounded-lg">
              <h3 className="font-bold text-amber-900 mb-2">⚠️ Raffle Terms (Please Read)</h3>
              <p className="text-amber-900 text-sm leading-relaxed">
                This raffle operates under a <strong>minimum participation threshold</strong>. If the minimum number of entries is reached, 
                one winner will receive the original artwork shown. If the threshold is <strong>not met</strong>, one winner will instead 
                receive a cash prize equal to {raffle?.cash_prize_percentage || 70}% of ticket sales. In all cases, a winner is <strong>guaranteed</strong>. 
                Both paid tickets and free email entries have identical odds of winning.
              </p>
            </div>

            {/* Threshold Information */}
            <div className="mb-8 grid md:grid-cols-3 gap-4">
              {/* Threshold Progress */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Threshold Progress</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Tickets Needed</span>
                      <span className="text-lg font-bold text-indigo-600">
                        {raffle?.threshold.tickets_needed || 0} more
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div 
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${raffle?.threshold.percentage_to_threshold || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {raffle?.threshold.percentage_to_threshold || 0}% toward {raffle?.threshold.minimum_required} tickets
                    </p>
                  </div>
                  {raffle?.threshold.threshold_met ? (
                    <div className="bg-green-100 border border-green-400 rounded p-2">
                      <p className="text-sm font-semibold text-green-700">✓ Threshold Met! Artwork will be awarded.</p>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 border border-yellow-400 rounded p-2">
                      <p className="text-sm font-semibold text-yellow-700">Threshold not yet met</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Remaining */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Time Remaining</h3>
                {countdown.expired ? (
                  <p className="text-lg font-bold text-red-600">Raffle Ended</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{countdown.days || 0}</div>
                      <div className="text-xs text-gray-600">Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{countdown.hours || 0}</div>
                      <div className="text-xs text-gray-600">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{countdown.minutes || 0}</div>
                      <div className="text-xs text-gray-600">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{countdown.seconds || 0}</div>
                      <div className="text-xs text-gray-600">Seconds</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tickets Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-4">Entry Summary</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Tickets Sold:</span>
                    <span className="font-bold text-indigo-600">{raffle?.threshold.tickets_sold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ticket Price:</span>
                    <span className="font-bold">${raffle?.ticket_price || 25}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Total Pool:</span>
                    <span className="font-bold text-green-600">${raffle?.total_revenue?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Outcome Scenarios */}
            <div className="mb-8 grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-bold text-green-900 mb-2">✓ If Threshold Met</h4>
                <p className="text-sm text-green-800">
                  {raffle?.outcome_scenarios.if_threshold_met}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-2">💰 If Threshold Not Met</h4>
                <p className="text-sm text-blue-800">
                  {raffle?.outcome_scenarios.if_threshold_not_met}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
              {/* Artwork Details */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <div className="flex items-center justify-center text-gray-400 h-64">
                    <span className="text-sm">{raffle?.artwork_title} Image</span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Artwork</h2>
                  <div className="space-y-3 text-gray-600 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">Artist:</span>
                      <span>{raffle?.artist_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Medium:</span>
                      <span>{raffle?.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Dimensions:</span>
                      <span>{raffle?.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Estimated Value:</span>
                      <span className="font-bold">${raffle?.estimated_value}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
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

              {/* Entry Options */}
              <div className="space-y-6">
                {/* Paid Entry */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Purchase Ticket</h3>
                  <PayPalRaffleCheckout 
                    ticketPrice={raffle?.ticket_price || 25}
                    onSuccess={handlePaymentSuccess}
                  />
                  <div className="mt-4 text-center text-xs text-gray-500 space-y-1">
                    <p>✅ Secure payment processing with PayPal</p>
                    <p>✅ Instant raffle entry confirmation</p>
                    <p>✅ Support young artists and ministry work</p>
                  </div>
                </div>

                {/* Free Entry */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Free Entry Option</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    No purchase necessary! One free entry per person with identical odds of winning.
                  </p>
                  
                  {freeEntrySuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                      ✓ Free entry confirmed! Check your email for details.
                    </div>
                  )}
                  
                  <form onSubmit={handleFreeEntry}>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={freeEntryEmail}
                      onChange={(e) => setFreeEntryEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-blue-300 rounded-lg mb-3 text-sm"
                      disabled={freeEntryLoading}
                    />
                    <button
                      type="submit"
                      disabled={freeEntryLoading || !freeEntryEmail}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm font-semibold"
                    >
                      {freeEntryLoading ? 'Processing...' : 'Enter Free Raffle'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Purchase or Enter Free</h3>
                  <p className="text-sm text-gray-600">Buy ticket or enter with email</p>
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
                  <p className="text-sm text-gray-600">Public results announced</p>
                </div>
              </div>
            </div>

            {/* Raffle Rules Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Want the complete details?</p>
              <a href="/raffle-protocols" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm">
                View Full Raffle Protocols & Rules →
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}