import React from 'react';
import Layout from '../components/layout/Layout';

const NewsletterPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // TODO: Implement actual newsletter subscription endpoint
    // For now, just show success message
    setSubscribed(true);
    setEmail('');
    
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The FUND Gallery Newsletter
            </h1>
            <p className="text-xl text-primary-100">
              Stay updated on new exhibitions, exclusive artwork releases, and special raffle announcements.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Subscribe Today</h2>

            {subscribed && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <p className="text-green-100 font-semibold">Thank you for subscribing! Check your email to confirm.</p>
              </div>
            )}

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-100 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {error && (
                <p className="text-red-300 text-sm">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Subscribe Now
              </button>
            </form>

            <p className="text-primary-200 text-sm mt-4 text-center">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

          {/* What You'll Get */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-4">What You'll Receive</h3>
            <ul className="space-y-3 text-primary-100">
              <li className="flex items-center gap-3">
                <span className="text-amber-500">✓</span>
                <span>Announcements of new artwork and exhibitions</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500">✓</span>
                <span>Exclusive raffle launch notifications</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500">✓</span>
                <span>Behind-the-scenes stories from Ferdinand</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-amber-500">✓</span>
                <span>Special subscriber-only offers and early access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsletterPage;
