import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About - Ferdinand Arts Gallery</title>
        <meta name="description" content="Learn about Ferdinand Arts Gallery's mission to support emerging African artists and Ferdinand Ssekyanja's journey toward aviation education through art." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                About Our Gallery
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
                Where art meets dreams, and creativity fuels aspirations
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Ferdinand Arts Gallery was founded with a unique purpose: to showcase exceptional 
                contemporary African art while directly supporting the educational dreams of talented 
                young artists. We believe that art has the power to transform lives, not just through 
                its beauty and cultural significance, but through its ability to create opportunities 
                and fund aspirations.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our gallery serves as a bridge between artistic expression and personal achievement, 
                where every artwork sold and every raffle ticket purchased contributes to something 
                greater than just art appreciation—it contributes to dreams taking flight.
              </p>
            </div>
            <div className="relative">
              <img
                src="/images/gallery-hero.jpg"
                alt="Gallery Mission"
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = '/images/artworks/playful-giraffe.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Ferdinand's Story */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ferdinand's Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The inspiring story behind our featured artist and his aviation dreams
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* The Artist */}
              <div className="bg-purple-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">The Artist</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Ferdinand Ssekyanja is a self-taught contemporary artist from Uganda whose vibrant 
                  works celebrate African wildlife, culture, and identity. His unique style blends 
                  traditional African motifs with modern artistic techniques, creating pieces that 
                  are both culturally rich and universally appealing.
                </p>
              </div>

              {/* The Dream */}
              <div className="bg-blue-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">The Dream</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Beyond his artistic talents, Ferdinand harbors a deep passion for aviation. His dream 
                  is to become a commercial pilot, viewing the world from above while continuing to create 
                  art inspired by his aerial perspectives. This dual passion represents the intersection 
                  of creativity and technical skill.
                </p>
              </div>

              {/* The Mission */}
              <div className="bg-green-50 rounded-lg p-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">The Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Every artwork sold and every raffle ticket purchased directly supports Ferdinand's 
                  aviation education fund. We've created a transparent system where art appreciation 
                  becomes a direct investment in someone's future, making every supporter part of 
                  Ferdinand's journey to the skies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-purple-600">🌟</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Authenticity</h3>
                <p className="text-gray-600">
                  We showcase genuine artistic expression that reflects cultural heritage and personal vision.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-blue-600">🤝</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600">
                  Building connections between artists, supporters, and dreamers across the globe.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">💡</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  Using creative approaches to merge art appreciation with meaningful impact.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-orange-600">📈</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-600">
                  Open about how funds are used and the direct impact of every contribution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Making Impact Through Art
              </h2>
              <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                Every interaction with our gallery creates ripples of positive change
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-300 mb-2">100%</div>
                <div className="text-lg font-medium mb-2">Transparent Funding</div>
                <p className="text-purple-200">
                  Every dollar from art sales and raffles goes directly to Ferdinand's education fund
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-blue-300 mb-2">$10K</div>
                <div className="text-lg font-medium mb-2">Education Goal</div>
                <p className="text-purple-200">
                  Target amount needed for Ferdinand's complete aviation education program
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-green-300 mb-2">∞</div>
                <div className="text-lg font-medium mb-2">Artistic Legacy</div>
                <p className="text-purple-200">
                  Supporting one artist's dream while inspiring countless others to pursue theirs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Be Part of the Journey
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join us in supporting Ferdinand's dreams while owning beautiful, meaningful art. 
              Every purchase makes a difference, every raffle ticket counts, and every supporter 
              becomes part of a story that connects art, education, and aviation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/raffles" className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Enter Current Raffle
              </Link>
              <Link href="/exhibitions" className="bg-white text-purple-600 border border-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                View All Artworks
              </Link>
              <Link href="/artists" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Meet Ferdinand
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}