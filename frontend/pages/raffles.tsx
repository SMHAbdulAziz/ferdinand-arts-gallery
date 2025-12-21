import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import RaffleTicketPurchase from '../components/raffle/RaffleTicketPurchase';

// Mock data - would come from API in real implementation
const activeRaffles = [
  {
    id: 'playful-giraffe',
    artworkTitle: 'Playful Giraffe',
    artistName: 'Ferdinand Ssekyanja',
    artworkImage: '/images/artworks/playful-giraffe.jpg',
    ticketPrice: 25,
    maxTickets: 100,
    ticketsSold: 0,
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    description: 'A vibrant acrylic painting that captures the playful spirit of the giraffe rendered in bold strokes and an expressive color palette. This original artwork showcases Ferdinand\'s unique contemporary African-inspired style.',
    dimensions: '100cm × 100cm',
    medium: 'Acrylic on Canvas',
    estimatedValue: 1050,
    year: '2024'
  }
];

const upcomingRaffles = [
  {
    id: 'majestic-lion',
    artworkTitle: 'Majestic Lion',
    artistName: 'Ferdinand Ssekyanja',
    artworkImage: '/images/artworks/coming-soon.jpg',
    estimatedValue: 800,
    launchDate: 'Late October 2025'
  },
  {
    id: 'wise-elephant',
    artworkTitle: 'Wise Elephant', 
    artistName: 'Ferdinand Ssekyanja',
    artworkImage: '/images/artworks/coming-soon.jpg',
    estimatedValue: 900,
    launchDate: 'November 2025'
  }
];

const RafflesPage: React.FC = () => {
  return (
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

      {/* Active Raffles */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
            Active Raffles
          </h2>
          
          {activeRaffles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {activeRaffles.map((raffle) => (
                <div key={raffle.id} className="space-y-8">
                  {/* Raffle Purchase Component */}
                  <RaffleTicketPurchase
                    raffleId={raffle.id}
                    artworkTitle={raffle.artworkTitle}
                    artworkImage={raffle.artworkImage}
                    ticketPrice={raffle.ticketPrice}
                    maxTickets={raffle.maxTickets}
                    ticketsSold={raffle.ticketsSold}
                    endDate={raffle.endDate}
                  />
                </div>
              ))}
              
              {/* Artwork Details */}
              {activeRaffles.map((raffle) => (
                <div key={`${raffle.id}-details`} className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl text-primary-900 mb-4">
                      About "{raffle.artworkTitle}"
                    </h3>
                    <p className="text-primary-700 leading-relaxed mb-6">
                      {raffle.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-2">Medium</h4>
                      <p className="text-primary-600">{raffle.medium}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-2">Dimensions</h4>
                      <p className="text-primary-600">{raffle.dimensions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-2">Year</h4>
                      <p className="text-primary-600">{raffle.year}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-900 mb-2">Estimated Value</h4>
                      <p className="text-primary-600 font-bold">${raffle.estimatedValue}</p>
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
                      href={`/artists/ferdinand`}
                      className="btn-secondary"
                    >
                      Learn More About Ferdinand
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="font-serif text-xl text-primary-600 mb-4">
                No active raffles at the moment
              </h3>
              <p className="text-primary-500">
                Check back soon for upcoming artwork raffles!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Raffles */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom section-padding">
          <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
            Coming Soon
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {upcomingRaffles.map((raffle) => (
              <div key={raffle.id} className="bg-white border border-primary-200 overflow-hidden">
                <div className="aspect-square relative bg-primary-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary-400 font-medium">Coming Soon</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 text-sm font-medium">
                      Upcoming
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-serif text-xl text-primary-900 mb-2">
                    {raffle.artworkTitle}
                  </h3>
                  <p className="text-primary-600 mb-4">{raffle.artistName}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-600">Estimated Value</span>
                      <span className="font-semibold">${raffle.estimatedValue}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-600">Expected Launch</span>
                      <span className="font-semibold">{raffle.launchDate}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full btn-secondary"
                    disabled
                  >
                    Notify Me When Available
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Raffle Results (PROTOCOL: Transparency) */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
            Completed Raffles & Results
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12 bg-primary-50 rounded-lg border-2 border-dashed border-primary-300">
              <p className="text-primary-600 mb-4">
                Past raffle results and winner announcements will be displayed here
              </p>
              <p className="text-primary-500 text-sm">
                Each completed raffle undergoes a verified random drawing and public disclosure of results per our Raffle Protocols.
              </p>
            </div>

            {/* Example completed raffle (when available) */}
            {/* 
            <div className="mt-8 bg-white border-2 border-primary-200 rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-3 gap-6 p-8">
                <div className="md:col-span-2">
                  <h3 className="font-serif text-2xl text-primary-900 mb-4">Raffle Title</h3>
                  <div className="space-y-2 text-primary-700 mb-6">
                    <p><strong>Outcome:</strong> Artwork Awarded</p>
                    <p><strong>Tickets Sold:</strong> 145 / 100 minimum (threshold met ✓)</p>
                    <p><strong>Total Pool:</strong> $3,625.00</p>
                    <p><strong>Winner:</strong> Randomly selected and notified</p>
                  </div>
                  <Link href="/raffle-results/[id]" as="/raffle-results/example">
                    <a className="btn-secondary">View Complete Results</a>
                  </Link>
                </div>
                <div className="md:col-span-1">
                  <div className="bg-green-100 border-2 border-green-400 p-6 rounded-lg text-center">
                    <p className="text-green-900 font-bold">🎉 Artwork Awarded</p>
                    <p className="text-sm text-green-800 mt-2">Winner Announced</p>
                  </div>
                </div>
              </div>
            </div>
            */}
          </div>

          <div className="text-center mt-8">
            <Link href="/raffle-protocols">
              <a className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                View Full Raffle Protocols & Transparency Standards →
              </a>
            </Link>
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
  );
};

export default RafflesPage;