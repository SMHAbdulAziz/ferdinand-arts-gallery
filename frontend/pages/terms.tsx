import React from 'react';
import Layout from '../components/layout/Layout';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-primary-100">
              Last updated: January 2, 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-primary-100 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using The FUND Gallery website (www.thefundgallery.org), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on The FUND Gallery website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Raffle Rules and Regulations</h2>
              
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Eligibility</h3>
              <p>
                To participate in raffles, you must be at least 18 years old and a legal resident of the United States.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Ticket Purchases</h3>
              <p>
                Raffle tickets are purchased through our secure payment system. Each ticket represents one entry into the drawing. Tickets are non-refundable once purchased.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Drawing and Winners</h3>
              <p>
                Winners are selected through a random drawing. If the minimum threshold of tickets is met, the winner receives the artwork. If the threshold is not met, per raffle terms, the winner receives a cash prize equivalent to a percentage of the ticket pool.
              </p>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Prize Fulfillment</h3>
              <p>
                Artwork winners are responsible for any shipping, insurance, or display costs. The FUND Gallery will facilitate prize delivery to the winner's specified address.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimer</h2>
              <p>
                The materials on The FUND Gallery website are provided on an 'as is' basis. The FUND Gallery makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Limitations of Liability</h2>
              <p>
                In no event shall The FUND Gallery or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The FUND Gallery website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Accuracy of Materials</h2>
              <p>
                The materials appearing on The FUND Gallery website could include technical, typographical, or photographic errors. The FUND Gallery does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-white/5 rounded border border-white/10">
                <p className="font-semibold">The FUND Gallery</p>
                <p>Email: contact@thefundgallery.org</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
