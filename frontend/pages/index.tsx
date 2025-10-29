import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Layout from '../components/layout/Layout';
import ImageCarousel from '../components/ui/ImageCarousel';
import fs from 'fs';
import path from 'path';

type ArtworkImage = {
  src: string;
  alt: string;
  title: string;
  description?: string;
};

type HomePageProps = {
  images: ArtworkImage[];
};

// Components for the homepage
const HeroSection = () => (
  <section className="relative h-screen min-h-[600px] flex items-center bg-primary-900 overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/artworks/lion-geometric-cubist-multicolor-facets.jpg"
        alt="Ferdinand's geometric cubist lion artwork"
        fill
        className="object-cover opacity-30"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-900/40" />
    </div>
    
    {/* Content */}
    <div className="relative z-10 container-custom section-padding">
      <div className="max-w-4xl">
        <div className="space-y-6 animate-fade-in">
          <h1 className="font-serif text-display-xl md:text-display-lg text-white leading-tight text-balance">
            Discover a new
            <br />
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-accent-400/30 blur-xl"></span>
              <span className="relative bg-gradient-to-r from-accent-400 via-accent-300 to-gallery-gold bg-clip-text text-transparent px-2 py-1 rounded-lg backdrop-blur-sm">
                kind of art
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-200 leading-relaxed max-w-2xl text-balance">
            Support young minority men of color in achieving their educational dreams 
            through the power of authentic African artistry.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Link href="/exhibitions" className="inline-flex items-center text-lg px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              View Current Exhibitions
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link href="/raffles" className="inline-flex items-center text-lg px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-900 font-medium rounded-lg transition-all duration-200 transform hover:scale-105">
              Support an Artist
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
    
    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex flex-col items-center text-white animate-bounce">
        <span className="text-sm mb-2">Scroll to explore</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </section>
);

const CurrentExhibitions: React.FC<{ images: ArtworkImage[] }> = ({ images }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h2 className="font-serif text-display-md text-primary-900 mb-6">
            Ferdinand's Art Collection
          </h2>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Explore Ferdinand Ssekyanja's vibrant artwork collection. Each piece tells a story 
            and helps fund his aviation education dreams.
          </p>
        </div>
        
        {/* Image Carousel */}
        <div className="max-w-4xl mx-auto mb-16">
          <ImageCarousel 
            images={images}
            autoPlay={true}
            interval={4000}
            showDots={true}
            showArrows={true}
            className="shadow-2xl"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Artwork Cards */}
          <div className="artwork-card">
            <div className="aspect-square relative overflow-hidden">
              <Image
                src="/images/artworks/playful-giraffe.jpg"
                alt="Playful Giraffe by Ferdinand Ssekyanja"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl text-primary-900 mb-2">Playful Giraffe</h3>
              <p className="text-primary-600 mb-3">Ferdinand Ssekyanja</p>
              <p className="text-sm text-primary-500 leading-relaxed">
                A vibrant acrylic painting capturing the playful spirit of African wildlife
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-accent-600 font-semibold">Active Raffle</span>
                <Link href="/raffle" className="text-primary-900 hover:text-accent-600 font-medium">
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        
          {/* Additional artwork placeholders */}
          <div className="artwork-card">
            <div className="aspect-square relative overflow-hidden bg-primary-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-400">Coming Soon</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl text-primary-900 mb-2">Majestic Lion</h3>
              <p className="text-primary-600 mb-3">Ferdinand Ssekyanja</p>
              <p className="text-sm text-primary-500 leading-relaxed">
                Next piece in the African wildlife series
              </p>
              <div className="mt-4">
                <span className="text-primary-500 font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
          
          <div className="artwork-card">
            <div className="aspect-square relative overflow-hidden bg-primary-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-primary-400">Coming Soon</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl text-primary-900 mb-2">Wise Elephant</h3>
              <p className="text-primary-600 mb-3">Ferdinand Ssekyanja</p>
              <p className="text-sm text-primary-500 leading-relaxed">
                Part of the limited edition wildlife collection
              </p>
              <div className="mt-4">
                <span className="text-primary-500 font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/exhibitions" className="btn-primary">
            View All Exhibitions
          </Link>
        </div>
      </div>
    </section>
  );
};

const FerdinandStory = () => (
  <section className="py-24 bg-primary-50">
    <div className="container-custom section-padding">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-display-sm text-primary-900">
            Meet Ferdinand Ssekyanja
          </h2>
          <p className="text-lg text-primary-700 leading-relaxed">
            A talented young painter from Entebbe, Uganda, Ferdinand creates vibrant 
            acrylic paintings that capture the essence of African wildlife with bold 
            strokes and expressive color palettes.
          </p>
          <p className="text-primary-600 leading-relaxed">
            Ferdinand dreams of becoming a pilot and aviation engineer. Through THE FUND, 
            we're helping him raise funds for his education in the United States while 
            building appreciation for his incredible artistic talent.
          </p>
          
          <div className="bg-white p-6 rounded-sm border border-primary-200">
            <h3 className="font-serif text-lg text-primary-900 mb-3">Education Fund Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress toward $269,000 goal</span>
                <span className="font-semibold">$12,500 raised</span>
              </div>
              <div className="w-full bg-primary-200 rounded-full h-2">
                <div className="bg-accent-500 h-2 rounded-full" style={{ width: '4.6%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/artists/ferdinand" className="btn-primary">
              Learn More About Ferdinand
            </Link>
            <Link href="/raffle" className="btn-secondary">
              Support His Journey
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-[4/5] relative overflow-hidden artwork-shadow">
            <Image
              src="/images/artists/ferdinand-studio.jpg"
              alt="Ferdinand Ssekyanja in his studio"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-4 artwork-shadow">
            <p className="text-sm font-medium text-primary-900">
              "Every stroke tells a story of dreams and determination"
            </p>
            <p className="text-xs text-primary-600 mt-1">- Ferdinand Ssekyanja</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CallToAction = () => (
  <section className="py-24 bg-primary-900">
    <div className="container-custom section-padding text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="font-serif text-display-sm text-white">
          Be part of something meaningful
        </h2>
        <p className="text-xl text-primary-200 leading-relaxed">
          Your participation in our art raffles directly supports Ferdinand's educational 
          journey and helps create opportunities for other young artists to follow their dreams.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-primary-800 p-6 border border-primary-700">
            <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-white mb-2">Support Artists</h3>
            <p className="text-primary-300 text-sm">
              Purchase raffle tickets to win beautiful artwork while supporting education
            </p>
          </div>
          
          <div className="bg-primary-800 p-6 border border-primary-700">
            <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-white mb-2">Fund Education</h3>
            <p className="text-primary-300 text-sm">
              70% of proceeds go directly to supporting Ferdinand's aviation education
            </p>
          </div>
          
          <div className="bg-primary-800 p-6 border border-primary-700">
            <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1.657-2.657 3.343-4.343C14 4 16 4 19 7c0 0 0 2-2 3.657" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-white mb-2">Create Impact</h3>
            <p className="text-primary-300 text-sm">
              Help build a sustainable model for supporting young minority artists globally
            </p>
          </div>
        </div>
        
        <div className="pt-8">
          <Link href="/raffles" className="btn-accent text-lg px-8 py-4">
            Start Supporting Today
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const HomePage: React.FC<HomePageProps> = ({ images }) => {
  return (
    <Layout
      title="THE FUND Gallery - Supporting Young Artists Through Education"
      description="Help young minority men of color achieve their educational dreams. Support Ferdinand Ssekyanja and other talented artists through art appreciation and raffle participation."
    >
      <HeroSection />
      <CurrentExhibitions images={images} />
      <FerdinandStory />
      <CallToAction />
    </Layout>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const artworksDir = path.join(publicDir, 'images', 'artworks');

    let files: string[] = [];
    try {
      files = fs.readdirSync(artworksDir);
    } catch (err) {
      // directory might not exist yet
      files = [];
    }

    const jpgFiles = files.filter((f) => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

    const images: ArtworkImage[] = jpgFiles.map((filename) => {
      const name = path.parse(filename).name.replace(/[-_]+/g, ' ');
      const title = name.split(' ').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ');
      return {
        src: `/images/artworks/${filename}`,
        alt: title,
        title,
      };
    });

    return {
      props: {
        images,
      },
    };
  } catch (err) {
    return {
      props: {
        images: [],
      },
    };
  }
};