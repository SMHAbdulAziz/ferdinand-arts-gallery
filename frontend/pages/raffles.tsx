import React, { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/layout/Layout';

const RafflesPage: React.FC = () => {
  useEffect(() => {
    // Initialize PayPal button when component mounts
    if (typeof window !== 'undefined' && (window as any).paypal) {
      (window as any).paypal.HostedButtons({
        hostedButtonId: "VGBSVXSENDZXJ",
      }).render("#paypal-container-VGBSVXSENDZXJ");
    }
  }, []);

  return (
    <>
      <Head>
        <script 
          src="https://www.paypal.com/sdk/js?client-id=BAAzB5PP9aIWWYD4zV82tAePpTTo4UV5KNJ_BbAY0cnKjN0N75nWHN5PZnSCsWpF80HoAxIA-HDljYfX08&components=hosted-buttons&enable-funding=venmo&currency=USD">
        </script>
      </Head>
      <Layout
        title="Art Raffles - THE FUND Gallery"
        description="Support Ferdinand's education by purchasing raffle tickets for authentic African artwork. Win beautiful art while funding dreams."
      >
      {/* Hero Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-display-md mb-6">
              Support Artists Through Art Raffles
            </h1>
            <p className="text-xl text-primary-200 leading-relaxed">
              Win authentic African artwork while directly funding Ferdinand's aviation 
              education dreams. Every ticket purchase makes a difference.
            </p>
          </div>
        </div>
      </section>

      {/* Active Raffles - PayPal Section */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
            Active Raffles
          </h2>
          
          <div className="max-w-4xl mx-auto bg-white border border-primary-200 rounded-lg p-8 shadow-lg">
            <h3 className="font-serif text-3xl text-primary-900 mb-6 text-center">
              "Playful Giraffe" Raffle Ticket
            </h3>
            
            {/* Price and Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-primary-600 mb-2">Ticket Price</p>
                <p className="text-4xl font-bold text-primary-900 mb-6">$10.00</p>
                
                <div className="space-y-3 text-sm text-primary-700">
                  <div className="flex justify-between">
                    <span>Raffle Ends:</span>
                    <span className="font-semibold">January 16, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Value:</span>
                    <span className="font-semibold">$25,000</span>
                  </div>
                </div>
              </div>

              {/* Image Placeholder */}
              <div className="bg-primary-100 rounded-lg overflow-hidden h-64 flex items-center justify-center">
                <Image
                  src="/images/Playful-Giraffe-In-Museum.png"
                  alt="Playful Giraffe - Original Artwork"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>

            {/* PayPal Button */}
            <div className="mb-6">
              <div id="paypal-container-VGBSVXSENDZXJ"></div>
            </div>

            <p className="text-xs text-primary-500 text-center">
              Secure payment powered by PayPal. Each purchase enters you into the raffle.
            </p>
          </div>
        </div>
      </section>

      {/* Artwork Details */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
              About the Artwork
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl text-primary-900 mb-4">
                  "Playful Giraffe"
                </h3>
                <p className="text-primary-700 leading-relaxed mb-6">
                  A vibrant original artwork celebrating the beauty and grace of African wildlife. This piece captures the playful spirit and majesty of the giraffe in authentic detail.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Medium</h4>
                  <p className="text-primary-600">Acrylic on Canvas</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Dimensions</h4>
                  <p className="text-primary-600">36 x 36 inches</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Year</h4>
                  <p className="text-primary-600">2024</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Estimated Value</h4>
                  <p className="text-primary-600 font-bold">$25,000</p>
                </div>
              </div>
              
              <div className="bg-accent-50 p-6 border border-accent-200 rounded-lg">
                <h4 className="font-semibold text-accent-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Impact of Your Purchase
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Supports Ferdinand's aviation education</span>
                    <span className="font-semibold text-accent-700">10% to FQMH</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-accent-200">
                    <span className="text-xs text-accent-700">Every ticket helps fund his dreams</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link 
                  href="/artists/ferdinand"
                  className="btn-secondary"
                >
                  Learn More About Ferdinand
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600">1</span>
              </div>
              <h3 className="font-serif text-lg text-primary-900 mb-3">Purchase Ticket</h3>
              <p className="text-primary-600 text-sm leading-relaxed">
                Secure PayPal checkout for $25. Each ticket gives you a chance to win 
                while supporting Ferdinand's aviation education dreams.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600">2</span>
              </div>
              <h3 className="font-serif text-lg text-primary-900 mb-3">Get Confirmation</h3>
              <p className="text-primary-600 text-sm leading-relaxed">
                Instant email confirmation with your raffle entry details. You'll receive 
                updates leading up to the drawing date.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600">3</span>
              </div>
              <h3 className="font-serif text-lg text-primary-900 mb-3">Random Drawing</h3>
              <p className="text-primary-600 text-sm leading-relaxed">
                Fair random selection when raffle ends. Winner notified by email and 
                receives this beautiful original artwork with free shipping included.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-600">4</span>
              </div>
              <h3 className="font-serif text-lg text-primary-900 mb-3">Winner Notified</h3>
              <p className="text-primary-600 text-sm leading-relaxed">
                Free shipping included. Artwork comes with Certificate of Authenticity. 
                Even if you don't win, you've helped fund Ferdinand's education.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
    </>
  );
};

export default RafflesPage;