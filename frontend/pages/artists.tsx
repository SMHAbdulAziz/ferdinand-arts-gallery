import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

interface Artist {
  id: string;
  name: string;
  location: string;
  bio: string;
  specialties: string[];
  education: string[];
  exhibitions: string[];
  awards: string[];
  statement: string;
  profileImage: string;
  featuredWorks: {
    title: string;
    image: string;
    year: string;
  }[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

const artists: Artist[] = [
  {
    id: 'ferdinand-ssekyanja',
    name: 'Ferdinand Ssekyanja',
    location: 'Entebbe, Uganda',
    bio: `Ferdinand Ssekyanja is a talented young artist from Uganda whose vibrant contemporary works 
    draw inspiration from African wildlife, culture, and his personal journey toward achieving his 
    aviation dreams. His art serves as both creative expression and a means to fund his education 
    in commercial aviation.`,
    specialties: [
      'Contemporary African Art',
      'Wildlife Portraits',
      'Abstract Expressionism',
      'Cultural Portraits',
      'Mixed Media',
      'Street Art Influences'
    ],
    education: [
      'Self-taught Artist (2020-Present)',
      'Pursuing Aviation Education (Current Goal)',
      'Studying Contemporary Art Techniques',
      'Wildlife Conservation Art Training'
    ],
    exhibitions: [
      'Dreams of Flight - Ferdinand Arts Gallery (2024-Present)',
      'African Wildlife Series - Online Exhibition (2024)',
      'Contemporary Portraits - Local Showcase (2023)',
      'Street Art Meets Canvas - Community Gallery (2023)'
    ],
    awards: [
      'Emerging Artist Recognition - Uganda Arts Council (2024)',
      'Wildlife Conservation Art Award (2023)',
      'Community Choice Award - Local Art Fair (2023)'
    ],
    statement: `My art is a bridge between my current reality and my dreams of flight. Each brushstroke 
    represents not just the beauty I see in African wildlife and culture, but also my determination 
    to soar beyond limitations. Through vibrant colors and bold compositions, I celebrate our heritage 
    while working toward a future where I can view the world from the sky as a commercial pilot. 
    Every painting sold brings me one step closer to the cockpit, making each piece a literal 
    investment in dreams taking flight.`,
    profileImage: '/images/artists/Ferdinand-Ssekyanja-1.jpg',
    featuredWorks: [
      {
        title: 'Playful Giraffe',
        image: '/images/artworks/playful-giraffe.jpg',
        year: '2024'
      },
      {
        title: 'Majestic Lion Golden Profile',
        image: '/images/artworks/majestic-lion-golden-profile.jpg',
        year: '2024'
      },
      {
        title: 'African Woman with Gold Earrings',
        image: '/images/artworks/african-woman-profile-gold-earrings-portrait.jpg',
        year: '2024'
      }
    ],
    socialMedia: {
      instagram: '@ferdinand_arts_ug',
      facebook: 'Ferdinand Arts Uganda'
    }
  }
];

export default function Artists() {
  const ferdinand = artists[0]; // Featured artist

  return (
    <Layout>
      <Head>
        <title>Artists - Ferdinand Arts Gallery</title>
        <meta name="description" content="Meet Ferdinand Ssekyanja, our featured contemporary African artist whose vibrant works support his aviation education dreams." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Our Artists
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
                Discover the passionate creators behind our extraordinary collection
              </p>
            </div>
          </div>
        </div>

        {/* Featured Artist - Ferdinand */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Artist Header */}
            <div className="relative h-96 bg-gradient-to-r from-purple-600 to-blue-600">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Artist</h2>
                  <h3 className="text-2xl md:text-3xl font-light">{ferdinand.name}</h3>
                  <p className="text-lg text-purple-200 mt-2">{ferdinand.location}</p>
                </div>
              </div>
            </div>

            {/* Artist Profile */}
            <div className="p-8 md:p-12">
              <div className="grid lg:grid-cols-3 gap-12">
                {/* Profile Image and Basic Info */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                      <img
                        src={ferdinand.profileImage}
                        alt={ferdinand.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/gallery-hero.jpg';
                        }}
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{ferdinand.name}</h4>
                    <p className="text-purple-600 font-medium mb-4">{ferdinand.location}</p>
                    
                    {/* Social Media Links */}
                    <div className="flex justify-center space-x-4 mb-6">
                      {ferdinand.socialMedia.instagram && (
                        <a href="#" className="text-purple-600 hover:text-purple-800">
                          <span className="text-sm">{ferdinand.socialMedia.instagram}</span>
                        </a>
                      )}
                      {ferdinand.socialMedia.facebook && (
                        <a href="#" className="text-purple-600 hover:text-purple-800">
                          <span className="text-sm">{ferdinand.socialMedia.facebook}</span>
                        </a>
                      )}
                    </div>

                    {/* Support Education Button */}
                    <Link href="/raffles" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105">
                      Support Ferdinand's Aviation Dreams
                    </Link>
                  </div>
                </div>

                {/* Artist Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Biography */}
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-4">Biography</h5>
                    <p className="text-gray-700 leading-relaxed mb-4">{ferdinand.bio}</p>
                  </div>

                  {/* Artist Statement */}
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-4">Artist Statement</h5>
                    <blockquote className="italic text-gray-700 leading-relaxed border-l-4 border-purple-400 pl-6">
                      "{ferdinand.statement}"
                    </blockquote>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-4">Artistic Specialties</h5>
                    <div className="flex flex-wrap gap-3">
                      {ferdinand.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education & Training */}
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-4">Education & Training</h5>
                    <ul className="space-y-2">
                      {ferdinand.education.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exhibitions */}
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-4">Recent Exhibitions</h5>
                    <ul className="space-y-2">
                      {ferdinand.exhibitions.map((exhibition, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          <span className="text-gray-700">{exhibition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Awards */}
                  <div>
                    <h5 className="text-xl font-bold text-gray-900 mb-4">Recognition & Awards</h5>
                    <ul className="space-y-2">
                      {ferdinand.awards.map((award, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-600 mr-2">🏆</span>
                          <span className="text-gray-700">{award}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Works */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Featured Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {ferdinand.featuredWorks.map((work, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/gallery-hero.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900">{work.title}</h4>
                    <p className="text-gray-600 text-sm">{work.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Fund Progress */}
          <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Supporting Ferdinand's Aviation Education
              </h3>
              <p className="text-gray-700 max-w-3xl mx-auto mb-6">
                Ferdinand's artistic journey is intertwined with his dream of becoming a commercial pilot. 
                Every artwork sold and every raffle ticket purchased contributes directly to his aviation 
                education fund, helping him soar toward his dreams while sharing his incredible talent with the world.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$250,000</div>
                  <div className="text-gray-600">Education Goal</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">In Progress</div>
                  <div className="text-gray-600">Current Status</div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/raffles" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors mr-4">
                  Enter Raffle
                </Link>
                <Link href="/exhibitions" className="bg-white text-purple-600 border border-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  View All Artworks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}