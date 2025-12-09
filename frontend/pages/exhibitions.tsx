import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  medium: string;
  dimensions?: string;
  year?: string;
  price?: string;
  image: string;
  description: string;
  category: string;
}

const updatedArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Playful Giraffe',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Acrylic on Canvas',
    dimensions: '100cm × 100cm',
    year: '2024',
    price: '$1050', // Updated price
    image: '/images/artworks/playful-giraffe.jpg',
    description: 'A vibrant acrylic painting that captures the playful spirit of the giraffe rendered in bold strokes and an expressive color palette.',
    category: 'Featured'
  },
  {
    id: '2',
    title: 'African Heritage Portrait Vibrant Colors',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Acrylic on Canvas',
    dimensions: '80cm × 60cm',
    year: '2024',
    price: '$825', // Updated price
    image: '/images/artworks/african-heritage-portrait-vibrant-colors.jpg',
    description: 'A stunning portrait celebrating African beauty and elegance, featuring intricate detail in the golden earrings.',
    category: 'Portraits'
  },
  {
    id: '3',
    title: 'Child Figure Blue Outfit Textured Expression',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Acrylic on Canvas',
    dimensions: '90cm × 70cm',
    year: '2024',
    price: '$975', // Updated price
    image: '/images/artworks/child-figure-blue-outfit-textured-expression.jpg',
    description: 'A powerful portrayal of the king of beasts, rendered in golden tones that emphasize strength and nobility.',
    category: 'Wildlife'
  },
  {
    id: '4',
    title: 'Elephant Family Waterfront Serene Bond',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Mixed Media on Canvas',
    dimensions: '100cm × 80cm',
    year: '2024',
    price: '$1125', // Updated price
    image: '/images/artworks/elephant-family-waterfront-serene-bond.jpg',
    description: 'Contemporary street art style meets wildlife in this explosive neon interpretation of the fastest land animal.',
    category: 'Contemporary'
  },
  {
    id: '5',
    title: 'Zebra Explosive Blue Orange Abstract',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Acrylic on Canvas',
    dimensions: '85cm × 65cm',
    year: '2024',
    price: '$900', // Updated price
    image: '/images/artworks/zebra-explosive-blue-orange-abstract.jpg',
    description: 'An abstract interpretation of the zebra using bold blue and orange contrasts to create dynamic movement.',
    category: 'Abstract'
  },
  {
    id: '6',
    title: 'Gorilla Impressionistic Colorful',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Oil on Canvas',
    dimensions: '75cm × 75cm',
    year: '2024',
    price: '$870', // Updated price
    image: '/images/artworks/gorilla-impressionistic-colorful.jpg',
    description: 'A colorful impressionistic take on the gentle giant of the forest, emphasizing emotion and movement.',
    category: 'Wildlife'
  },
  {
    id: '7',
    title: 'Lion Geometric Cubist Multicolor',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Acrylic on Canvas',
    dimensions: '90cm × 90cm',
    year: '2024',
    price: '$1050', // Updated price
    image: '/images/artworks/lion-geometric-cubist-multicolor-facets.jpg',
    description: 'A cubist interpretation breaking down the lion into geometric facets of brilliant color.',
    category: 'Cubist'
  },
  {
    id: '8',
    title: 'Bull Dynamic Blue Orange Contemporary',
    artist: 'Ferdinand Ssekyanja',
    medium: 'Acrylic on Canvas',
    dimensions: '95cm × 75cm',
    year: '2024',
    price: '$975', // Updated price
    image: '/images/artworks/bull-dynamic-blue-orange-contemporary.jpg',
    description: 'A contemporary piece capturing the raw power and energy of the bull in dynamic blue and orange tones.',
    category: 'Contemporary'
  }
];

const categories = ['All', 'Featured', 'Wildlife', 'Portraits', 'Abstract', 'Contemporary', 'Cubist'];

export default function Exhibitions() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredArtworks, setFilteredArtworks] = useState(updatedArtworks);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredArtworks(updatedArtworks);
    } else {
      setFilteredArtworks(updatedArtworks.filter(artwork => artwork.category === selectedCategory));
    }
  }, [selectedCategory]);

  return (
    <Layout>
      <Head>
        <title>Exhibitions - Ferdinand Arts Gallery</title>
        <meta name="description" content="Current exhibitions featuring Ferdinand Ssekyanja's vibrant African-inspired contemporary art. Explore our collection of wildlife, portraits, and abstract pieces." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Current Exhibitions
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
                Discover Ferdinand Ssekyanja's vibrant collection of African-inspired contemporary art
              </p>
            </div>
          </div>
        </div>

        {/* Featured Exhibition */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Exhibition: Dreams of Flight
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A special collection supporting Ferdinand's aviation education dreams. Each piece represents 
              the journey from artistic expression to achieving one's aspirations.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Artwork Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredArtworks.map((artwork) => (
              <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/gallery-hero.jpg';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {artwork.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artwork.title}</h3>
                  <p className="text-purple-600 font-medium mb-2">{artwork.artist}</p>
                  <p className="text-sm text-gray-600 mb-2">{artwork.medium}</p>
                  {artwork.dimensions && (
                    <p className="text-sm text-gray-600 mb-2">{artwork.dimensions}</p>
                  )}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{artwork.description}</p>
                  
                  <div className="flex justify-between items-center">
                    {artwork.price && (
                      <span className="text-lg font-bold text-purple-600">{artwork.price}</span>
                    )}
                    <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Exhibition Info */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Exhibition Details</h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Duration:</strong> Ongoing Exhibition</p>
                  <p><strong>Artist:</strong> Ferdinand Ssekyanja</p>
                  <p><strong>Location:</strong> Ferdinand Arts Gallery (Online)</p>
                  <p><strong>Pieces:</strong> {updatedArtworks.length} Original Works</p>
                  <p><strong>Medium:</strong> Acrylic, Oil, Mixed Media</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About the Collection</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ferdinand's "Dreams of Flight" collection represents the intersection of artistic passion 
                  and personal aspiration. Each piece in this exhibition contributes to Ferdinand's goal 
                  of pursuing aviation education while showcasing his remarkable talent in contemporary 
                  African-inspired art. The collection features vibrant wildlife portraits, abstract 
                  interpretations, and cultural celebrations that reflect both his Ugandan heritage 
                  and his dreams of taking flight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}