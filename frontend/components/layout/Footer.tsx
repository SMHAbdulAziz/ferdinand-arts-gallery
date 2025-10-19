import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom section-padding">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white flex items-center justify-center">
                  <span className="text-primary-900 font-bold">TF</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-semibold text-xl text-white leading-none">
                    THE FUND
                  </span>
                  <span className="text-sm text-primary-300 uppercase tracking-wider">
                    Gallery
                  </span>
                </div>
              </div>
              <p className="text-primary-300 text-base leading-relaxed max-w-md">
                Helping young minority men of color achieve their worthwhile dreams through 
                advancements in education. Supporting talented artists like Ferdinand Ssekyanja 
                in pursuing their educational goals.
              </p>
              <div className="mt-6">
                <Link href="/about" className="text-accent-400 hover:text-accent-300 font-medium">
                  Learn more about our mission →
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-4">Gallery</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/exhibitions" className="text-primary-300 hover:text-white transition-colors">
                    Current Exhibitions
                  </Link>
                </li>
                <li>
                  <Link href="/artists" className="text-primary-300 hover:text-white transition-colors">
                    Featured Artists
                  </Link>
                </li>
                <li>
                  <Link href="/raffles" className="text-primary-300 hover:text-white transition-colors">
                    Active Raffles
                  </Link>
                </li>
                <li>
                  <Link href="/artists/ferdinand" className="text-primary-300 hover:text-white transition-colors">
                    Ferdinand's Journey
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/raffles" className="text-primary-300 hover:text-white transition-colors">
                    Buy Raffle Tickets
                  </Link>
                </li>
                <li>
                  <Link href="/donate" className="text-primary-300 hover:text-white transition-colors">
                    Make a Donation
                  </Link>
                </li>
                <li>
                  <Link href="/sponsors" className="text-primary-300 hover:text-white transition-colors">
                    Become a Sponsor
                  </Link>
                </li>
                <li>
                  <Link href="/newsletter" className="text-primary-300 hover:text-white transition-colors">
                    Newsletter Signup
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-primary-400 text-sm">
              © {currentYear} THE FUND Gallery. Supporting education through art.
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-primary-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-primary-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-primary-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;