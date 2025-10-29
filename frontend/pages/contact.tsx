import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Contact - Ferdinand Arts Gallery</title>
        <meta name="description" content="Get in touch with Ferdinand Arts Gallery. Contact us about artworks, commissions, exhibitions, or Ferdinand's aviation education fund." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
                We'd love to hear from you. Let's start a conversation about art, dreams, and making a difference.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-green-400 text-xl">✓</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Message sent successfully!
                      </h3>
                      <p className="mt-1 text-sm text-green-700">
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-red-400 text-xl">✗</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error sending message
                      </h3>
                      <p className="mt-1 text-sm text-red-700">
                        Please try again or contact us directly via email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                    What can we help you with?
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="artwork">Artwork Purchase</option>
                    <option value="commission">Commission Request</option>
                    <option value="education">Ferdinand's Education Fund</option>
                    <option value="exhibition">Exhibition Information</option>
                    <option value="media">Media & Press</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief subject line"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Please share your thoughts, questions, or how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Gallery Information */}
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gallery Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">🌐</span>
                    <div>
                      <div className="font-medium text-gray-900">Online Gallery</div>
                      <div className="text-gray-600">Available 24/7 worldwide</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">📧</span>
                    <div>
                      <div className="font-medium text-gray-900">Email</div>
                      <a href="mailto:info@ferdinandarts.gallery" className="text-purple-600 hover:text-purple-800">
                        info@ferdinandarts.gallery
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">🌍</span>
                    <div>
                      <div className="font-medium text-gray-900">Artist Location</div>
                      <div className="text-gray-600">Kampala, Uganda</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">⏰</span>
                    <div>
                      <div className="font-medium text-gray-900">Response Time</div>
                      <div className="text-gray-600">Within 24 hours</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ferdinand's Education Fund */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Support Ferdinand's Aviation Dreams
                </h3>
                <p className="text-gray-700 mb-4">
                  Every inquiry, every artwork purchase, and every raffle ticket contributes to 
                  Ferdinand's goal of becoming a commercial pilot. Your support makes dreams take flight.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">$10,000</div>
                    <div className="text-sm text-gray-600">Education Goal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">Active</div>
                    <div className="text-sm text-gray-600">Current Campaign</div>
                  </div>
                </div>
                <a 
                  href="/raffles" 
                  className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Enter Current Raffle
                </a>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">How do I purchase artwork?</div>
                    <div className="text-gray-600 text-sm">
                      Browse our exhibitions page and contact us about specific pieces you're interested in.
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900 mb-1">How does the education fund work?</div>
                    <div className="text-gray-600 text-sm">
                      100% of proceeds from art sales and raffles go directly to Ferdinand's aviation education.
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900 mb-1">Can I commission custom artwork?</div>
                    <div className="text-gray-600 text-sm">
                      Yes! Contact us with your ideas and we'll work with Ferdinand on custom pieces.
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-gray-900 mb-1">Do you ship internationally?</div>
                    <div className="text-gray-600 text-sm">
                      Yes, we arrange secure international shipping for all artwork purchases.
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Ferdinand's Journey</h3>
                <p className="text-gray-600 mb-4">
                  Stay updated on new artworks, exhibition progress, and Ferdinand's path to aviation education.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="bg-purple-100 text-purple-600 p-3 rounded-lg hover:bg-purple-200 transition-colors">
                    <span className="text-sm font-medium">Instagram</span>
                  </a>
                  <a href="#" className="bg-blue-100 text-blue-600 p-3 rounded-lg hover:bg-blue-200 transition-colors">
                    <span className="text-sm font-medium">Facebook</span>
                  </a>
                  <a href="#" className="bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                    <span className="text-sm font-medium">Newsletter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}