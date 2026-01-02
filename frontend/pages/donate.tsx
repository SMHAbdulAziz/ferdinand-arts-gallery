import React from 'react';
import Layout from '../components/layout/Layout';

const DonatePage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Support The FUND Gallery
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Your contribution directly supports Ferdinand's artistic mission and helps fund future exhibitions and community programs.
            </p>
          </div>

          {/* Donation Info Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">How Your Gift Makes a Difference</h2>
            
            <div className="space-y-4 text-primary-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Support the Artist</h3>
                  <p>Direct financial support helps Ferdinand continue creating meaningful artwork and exhibitions.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Fund Community Programs</h3>
                  <p>Contributions support workshops, educational initiatives, and community engagement activities.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Enable Future Exhibitions</h3>
                  <p>Support helps bring new exhibitions and artistic projects to life for our audience.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Donation Portal Coming Soon</h3>
            <p className="text-primary-100 mb-6">
              We're working to set up secure donation channels. In the meantime, please reach out through our contact page to discuss supporting The FUND Gallery.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonatePage;
