import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';

const FerdinandProfile: React.FC = () => {
  // Mock data - would come from API
  const artist = {
    name: 'Ferdinand Ssekyanja',
    location: 'Entebbe, Uganda',
    birthYear: 'July 16, 2007',
    education_goal: 'Pilot Training & Aviation Engineering in the USA',
    education_fund_target: 250000,
    education_fund_raised: 0,
    bio: `A talented young painter from Entebbe, Uganda, Ferdinand creates vibrant acrylic paintings that capture the essence of African wildlife with bold strokes and expressive color palettes. His artistic journey began in childhood, drawing inspiration from the rich biodiversity surrounding Lake Victoria and the diverse wildlife of Uganda.

Ferdinand's unique style combines traditional African artistic elements with contemporary techniques, creating artwork that brings joy and tells stories of his homeland. Each piece reflects his deep connection to nature and his dream of bridging cultures through art.

Beyond his artistic pursuits, Ferdinand harbors a passionate dream of becoming a pilot and aviation engineer. He sees aviation as another form of art - the art of flight - and hopes to one day soar through the skies while continuing to create artwork that celebrates African culture and wildlife.`,
    quote: "Every stroke tells a story of dreams and determination. Through art, I share the beauty of Uganda while working toward my goal of touching the sky.",
    contact: {
      email: 'ferdinandtomous@gmail.com',
      whatsapp: '+256-787697305'
    },
    artworks: [
      {
        id: 'playful-giraffe',
        title: 'Playful Giraffe',
        image: '/images/playful-giraffe.jpg',
        year: '2024',
        medium: 'Acrylic on Canvas',
        dimensions: '36 x 36 inches',
        status: 'Active Raffle',
        description: 'A vibrant piece capturing the playful spirit of the giraffe with bold strokes and warm colors.'
      },
      {
        id: 'multi-colored-lion',
        title: 'Multi-Colored Lion Street Art',
        image: '/images/multi-colored-lion-street-art-neon-vibrance.jpg',
        year: '2024',
        medium: 'Acrylic on Canvas',
        dimensions: 'TBD',
        status: 'Coming Soon',
        description: 'A vibrant street art inspired piece showcasing the lion in neon colors with dynamic energy.'
      },
      {
        id: 'elephant-landscape',
        title: 'Elephant in Golden Landscape',
        image: '/images/elephant-wading-golden-serene-landscape.jpg',
        year: '2024',
        medium: 'Acrylic on Canvas',
        dimensions: 'TBD',
        status: 'Coming Soon',
        description: 'A serene landscape capturing an elephant wading through golden waters in a tranquil setting.'
      }
    ]
  };

  const fundProgress = (artist.education_fund_raised / artist.education_fund_target) * 100;

  return (
    <Layout
      title={`${artist.name} - Artist Profile | THE FUND Gallery`}
      description={`Learn about ${artist.name}, a talented young artist from Uganda pursuing his dreams in aviation through art. Support his educational journey.`}
    >
      {/* Hero Section with Artist Photo */}
      <section className="relative py-24 bg-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/artists/ferdinand-studio.jpg"
            alt="Ferdinand in his studio"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 to-primary-900/50" />
        </div>
        
        <div className="relative z-10 container-custom section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-display-md mb-4">{artist.name}</h1>
                <p className="text-xl text-primary-200 mb-2">{artist.location}</p>
                <p className="text-primary-300">Born {artist.birthYear}</p>
              </div>
              
              <blockquote className="text-lg text-accent-300 italic leading-relaxed border-l-4 border-accent-400 pl-6">
                "{artist.quote}"
              </blockquote>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/raffles" className="btn-accent">
                  Support Ferdinand's Journey
                </Link>
                <Link href="#artworks" className="btn-secondary bg-accent-500 hover:bg-accent-600 text-white border-accent-500 hover:border-accent-600">
                  View Artwork Collection
                </Link>
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <div className="w-48 h-48 relative overflow-hidden rounded-full ring-4 ring-white shadow-xl">
                <Image
                  src="/images/artists/Ferdinand-Ssekyanja.png"
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Fund Progress */}
      <section className="py-16 bg-accent-50">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-display-sm text-primary-900 mb-8">
              Supporting Ferdinand's Education Dream
            </h2>
            
            <div className="bg-white p-8 border border-accent-200 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                <div>
                  <h3 className="font-serif text-lg text-primary-900 mb-2">Dream</h3>
                  <p className="text-primary-600 text-sm leading-relaxed">
                    {artist.education_goal}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-primary-900 mb-2">Target</h3>
                  <p className="text-2xl font-bold text-accent-600">
                    ${artist.education_fund_target.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-primary-900 mb-2">Raised</h3>
                  <p className="text-2xl font-bold text-primary-900">
                    ${artist.education_fund_raised.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Fund Progress</span>
                  <span className="font-semibold">{fundProgress.toFixed(1)}% Complete</span>
                </div>
                <div className="w-full bg-primary-200 rounded-full h-4">
                  <div 
                    className="bg-accent-500 h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${fundProgress}%` }}
                  />
                </div>
              </div>
            </div>
            
            <p className="text-primary-700 leading-relaxed max-w-2xl mx-auto">
              Every raffle ticket purchase directly supports Ferdinand's education fund. 
              70% of proceeds go toward his pilot training and aviation engineering studies, 
              helping make his dreams of flight a reality.
            </p>
          </div>
        </div>
      </section>

      {/* Artist Biography */}
      <section className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
              Ferdinand's Story
            </h2>
            
            <div className="prose prose-lg max-w-none text-primary-700 leading-relaxed space-y-6">
              {artist.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artwork Collection */}
      <section id="artworks" className="py-16 bg-primary-50">
        <div className="container-custom section-padding">
          <h2 className="font-serif text-display-sm text-primary-900 text-center mb-12">
            Artwork Collection
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artist.artworks.map((artwork) => (
              <div key={artwork.id} className="artwork-card">
                <div className="aspect-square relative overflow-hidden">
                  {artwork.status === 'Coming Soon' ? (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-400 font-medium">Coming Soon</span>
                    </div>
                  ) : (
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-medium text-white ${
                      artwork.status === 'Active Raffle' ? 'bg-accent-500' : 'bg-primary-600'
                    }`}>
                      {artwork.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-serif text-xl text-primary-900 mb-2">
                    {artwork.title}
                  </h3>
                  <div className="text-sm text-primary-600 space-y-1 mb-3">
                    <p>{artwork.year} • {artwork.medium}</p>
                    <p>{artwork.dimensions}</p>
                  </div>
                  <p className="text-primary-700 text-sm leading-relaxed mb-4">
                    {artwork.description}
                  </p>
                  
                  {artwork.status === 'Active Raffle' && (
                    <Link href="/raffles" className="btn-accent w-full text-center">
                      Enter Raffle
                    </Link>
                  )}
                  
                  {artwork.status === 'Coming Soon' && (
                    <button className="w-full btn-secondary" disabled>
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-display-sm mb-8">
              Get Involved
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-primary-800 p-6 border border-primary-700">
                <h3 className="font-serif text-lg mb-4">Support Through Art</h3>
                <p className="text-primary-300 text-sm leading-relaxed mb-4">
                  Purchase raffle tickets to win authentic artwork while directly 
                  supporting Ferdinand's educational journey.
                </p>
                <Link href="/raffles" className="btn-accent w-full text-center">
                  View Active Raffles
                </Link>
              </div>
              
              <div className="bg-primary-800 p-6 border border-primary-700">
                <h3 className="font-serif text-lg mb-4">Follow the Journey</h3>
                <p className="text-primary-300 text-sm leading-relaxed mb-4">
                  Stay updated on Ferdinand's progress toward his aviation goals 
                  and new artwork releases.
                </p>
                <Link href="/newsletter" className="btn-secondary w-full text-center bg-accent-500 hover:bg-accent-600 text-white border-accent-500 hover:border-accent-600">
                  Join Newsletter
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-primary-300 mb-4">
                Want to connect directly with Ferdinand?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={`mailto:${artist.contact.email}`}
                  className="text-accent-400 hover:text-accent-300 font-medium"
                >
                  {artist.contact.email}
                </a>
                <a 
                  href={`https://wa.me/${artist.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  className="text-accent-400 hover:text-accent-300 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp: {artist.contact.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FerdinandProfile;