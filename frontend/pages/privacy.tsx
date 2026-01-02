import React from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-primary-100">
              Last updated: January 2, 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 text-primary-100 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                The FUND Gallery ("we," "us," "our," or "Company") operates the www.thefundgallery.org website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information Collection and Use</h2>
              <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
              
              <h3 className="text-lg font-semibold text-white mt-4 mb-2">Types of Data Collected:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal Data (name, email address, phone number, address, etc.)</li>
                <li>Usage Data (pages visited, time spent, browser type, etc.)</li>
                <li>Payment Information (processed securely through PayPal)</li>
                <li>Raffle Participation Data (ticket purchases, drawing results)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Use of Data</h2>
              <p>The FUND Gallery uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer care and support</li>
                <li>To gather analysis or valuable information so we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent, and address technical issues</li>
                <li>To process raffle entries and announce winners</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Security of Data</h2>
              <p>
                The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPage;
