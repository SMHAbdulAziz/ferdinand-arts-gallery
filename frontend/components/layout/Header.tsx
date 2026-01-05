import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Exhibitions', href: '/exhibitions' },
    { name: 'Artists', href: '/artists' },
    { name: 'Raffles', href: '/raffles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    return router.pathname === href;
  };

  return (
    <header className="relative z-40 bg-white border-b border-primary-200">
      <div className="container-custom section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-semibold text-lg text-primary-900 leading-none">
                  THE FUND
                </span>
                <span className="text-xs text-primary-600 uppercase tracking-wider">
                  Gallery
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-900 border-b-2 border-primary-900 pb-1'
                    : 'text-primary-600 hover:text-primary-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Auth */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {!loading ? (
              <>
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium text-primary-900">{user?.firstName}</span>
                      <svg className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-primary-200 z-50">
                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-primary-900 hover:bg-primary-50 first:rounded-t-lg">
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                            router.push('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-primary-900 hover:text-primary-600 transition-colors">
                      Login
                    </Link>
                    <Link href="/signup" className="btn-primary">
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            ) : null}
            {isAuthenticated && (
              <Link href="/raffle" className="btn-primary">
                Support Artists
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-primary-600 hover:text-primary-900 focus:outline-none focus:text-primary-900 transition-colors duration-200"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu (Hidden by default - would need state management for toggle) */}
      <div className="lg:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-primary-200">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                isActive(item.href)
                  ? 'text-primary-900 bg-primary-50'
                  : 'text-primary-600 hover:text-primary-900 hover:bg-primary-50'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="px-3 py-2">
            <Link href="/raffle" className="btn-primary w-full text-center">
              Support Artists
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;