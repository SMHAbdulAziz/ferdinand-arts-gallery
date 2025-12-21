import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function RaffleResultsPage() {
  const router = useRouter();
  const { raffleId } = router.query;
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!raffleId) return;

    const fetchOutcome = async () => {
      try {
        const response = await fetch(`/api/raffle/outcome-summary?raffleId=${raffleId}`);
        const data = await response.json();

        if (data.success) {
          setOutcome(data.summary);
        } else {
          setError(data.error || 'Unable to load raffle results');
        }
      } catch (err) {
        setError('Network error loading results');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOutcome();
  }, [raffleId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading raffle results...</p>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Results</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => router.back()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Raffle Results - {outcome?.raffle_title} - The FUND Gallery</title>
        <meta name="description" content={`Results for ${outcome?.raffle_title} raffle`} />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {outcome?.raffle_title} - Raffle Results
            </h1>
            <p className="text-lg text-gray-600">
              Drawing Date: {new Date(outcome?.outcome.draw_timestamp).toLocaleDateString()}
            </p>
          </div>

          {/* Outcome Type Banner */}
          <div className={`rounded-lg p-8 mb-8 text-white text-center ${
            outcome?.outcome.threshold_met 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          }`}>
            <h2 className="text-3xl font-bold mb-2">
              {outcome?.outcome.threshold_met ? '🎉 Artwork Awarded!' : '💰 Cash Prize Awarded'}
            </h2>
            <p className="text-xl mb-4">
              {outcome?.outcome.threshold_met 
                ? 'The minimum threshold was met!'
                : 'Thank you for participating. A cash prize has been awarded.'}
            </p>
            <p className="text-sm opacity-90">
              {outcome?.disclosure}
            </p>
          </div>

          {/* Outcome Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Threshold Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Raffle Metrics</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Minimum Threshold:</span>
                  <span className="font-semibold">{outcome?.outcome.tickets_required} tickets</span>
                </div>
                <div className="flex justify-between">
                  <span>Tickets Sold:</span>
                  <span className="font-semibold">{outcome?.outcome.tickets_sold} tickets</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Entries:</span>
                  <span className="font-semibold">{outcome?.total_entries}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span>Total Pool:</span>
                  <span className="font-bold text-indigo-600">${outcome?.outcome.total_pool.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Winner Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Winner</h3>
              {outcome?.winner ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Winner Name</p>
                    <p className="text-lg font-semibold text-gray-900">{outcome.winner.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prize</p>
                    <p className="text-lg font-semibold text-indigo-600">{outcome.winner.prize}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                    <p className="text-sm text-indigo-800">
                      A notification has been sent to the winner with next steps.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Winner selection pending...</p>
              )}
            </div>
          </div>

          {/* Artwork Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">About the Artwork</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div>
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                  {outcome?.artwork.images?.[0] ? (
                    <img 
                      src={outcome.artwork.images[0]} 
                      alt={outcome.artwork.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>Artwork Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Title</h4>
                  <p className="text-2xl font-bold text-gray-900">{outcome?.artwork.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Artist</h4>
                  <p className="text-lg text-gray-800">{outcome?.artwork.artist}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-1">Estimated Value</h4>
                  <p className="text-lg font-semibold text-indigo-600">${outcome?.artwork.estimated_value}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Description</h4>
                  <p className="text-gray-700">{outcome?.artwork.description}</p>
                </div>

                {outcome?.outcome.threshold_met && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ This original artwork includes a Certificate of Authenticity
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PROTOCOL: Mandatory Disclosure */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded">
            <h4 className="font-semibold text-amber-900 mb-2">Raffle Transparency Statement</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              This raffle operated under a minimum participation threshold model as outlined in our official Raffle Protocols. 
              The outcome above represents the verified result of our fair, random drawing. All entry methods (paid tickets and 
              free entries) had equal odds of winning. This outcome is permanently recorded and cannot be changed. 
              For complete details, see our <a href="/raffle-protocols" className="underline font-semibold">Raffle Protocols document</a>.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center mt-12 space-x-4">
            <button 
              onClick={() => router.push('/raffles')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 inline-block"
            >
              View All Raffles
            </button>
            <button 
              onClick={() => router.push('/')}
              className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 inline-block"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
