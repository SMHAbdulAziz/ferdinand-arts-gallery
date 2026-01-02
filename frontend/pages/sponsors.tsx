import React from 'react';
import Layout from '../components/layout/Layout';

const SponsorsPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Sponsors & Partners
            </h1>
            <p className="text-xl text-primary-100">
              Generous support from our community partners makes The FUND Gallery's mission possible.
            </p>
          </div>

          {/* Sponsorship Tiers */}
          <div className="space-y-8">
            {/* Platinum Sponsors */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-amber-300 mb-4">Platinum Partners</h2>
              <p className="text-primary-100">
                Coming soon - we're building relationships with generous sponsors who share our vision for arts and community support.
              </p>
            </div>

            {/* Gold Sponsors */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">Gold Partners</h2>
              <p className="text-primary-100">
                Interested in becoming a partner? We welcome sponsors at all levels who are passionate about supporting the arts.
              </p>
            </div>

            {/* Become a Sponsor CTA */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Become a Sponsor</h3>
              <p className="text-white/90 mb-6">
                Does your organization want to support Ferdinand's artistic vision and The FUND Gallery's community programs? We'd love to partner with you.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-white hover:bg-gray-100 text-amber-600 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Reach Out to Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SponsorsPage;
