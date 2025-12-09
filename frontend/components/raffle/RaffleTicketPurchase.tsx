import React, { useState } from 'react';
import Image from 'next/image';

interface RaffleTicketPurchaseProps {
  raffleId: string;
  artworkTitle: string;
  artworkImage: string;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  endDate: Date;
}

const RaffleTicketPurchase: React.FC<RaffleTicketPurchaseProps> = ({
  raffleId,
  artworkTitle,
  artworkImage,
  ticketPrice,
  maxTickets,
  ticketsSold,
  endDate
}) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const timeLeft = endDate.getTime() - Date.now();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  const ticketsRemaining = maxTickets - ticketsSold;
  const totalCost = ticketQuantity * ticketPrice;

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Stripe integration would go here
    try {
      // API call to create payment intent
      console.log('Processing purchase...', {
        raffleId,
        ticketQuantity,
        email,
        totalCost
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page or show success message
      alert(`Success! You've purchased ${ticketQuantity} ticket(s) for $${totalCost}`);
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-primary-200 overflow-hidden rounded-lg shadow-lg">
      {/* Artwork Display */}
      <div className="aspect-square relative bg-gray-100">
        <Image
          src={artworkImage}
          alt={artworkTitle}
          fill
          className="object-contain"
          priority
        />
        <div className="absolute top-4 left-4">
          <span className="bg-accent-500 text-white px-3 py-1 text-sm font-medium rounded">
            Active Raffle
          </span>
        </div>
      </div>

      {/* Raffle Details */}
      <div className="p-6 space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-primary-900 mb-2">{artworkTitle}</h2>
          <p className="text-primary-600">by Ferdinand Ssekyanja</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-primary-600">Tickets Sold</span>
            <span className="font-semibold">{ticketsSold} of {maxTickets}</span>
          </div>
          <div className="w-full bg-primary-200 rounded-full h-2">
            <div 
              className="bg-accent-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(ticketsSold / maxTickets) * 100}%` }}
            />
          </div>
        </div>

        {/* Time Remaining */}
        <div className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200">
          <div>
            <p className="text-sm text-primary-600">Drawing in</p>
            <p className="font-semibold text-primary-900">
              {daysLeft > 0 ? `${daysLeft} days` : 'Less than 1 day'}
            </p>
          </div>
          <div>
            <p className="text-sm text-primary-600">Tickets remaining</p>
            <p className="font-semibold text-primary-900">{ticketsRemaining}</p>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-primary-300 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Number of Tickets
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                className="w-10 h-10 border border-primary-300 flex items-center justify-center hover:bg-primary-50 transition-colors"
                disabled={ticketQuantity <= 1}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div className="flex-1 text-center">
                <span className="text-lg font-semibold">{ticketQuantity}</span>
                <span className="text-sm text-primary-600 block">
                  × ${ticketPrice} each
                </span>
              </div>
              
              <button
                onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                className="w-10 h-10 border border-primary-300 flex items-center justify-center hover:bg-primary-50 transition-colors"
                disabled={ticketQuantity >= 10 || ticketQuantity >= ticketsRemaining}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Total Cost */}
          <div className="flex items-center justify-between p-4 bg-accent-50 border-2 border-accent-200 rounded-lg">
            <div>
              <span className="text-sm text-accent-700 block">Total Price</span>
              <span className="text-xs text-accent-600">Includes 10% donation to FOMI</span>
            </div>
            <span className="text-2xl font-bold text-accent-900">${totalCost}</span>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={!email || ticketsRemaining === 0 || isProcessing}
            className={`w-full py-4 px-6 font-semibold text-lg transition-all duration-200 ${
              !email || ticketsRemaining === 0 || isProcessing
                ? 'bg-primary-300 text-primary-500 cursor-not-allowed'
                : 'bg-accent-600 hover:bg-accent-700 text-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                Processing...
              </div>
            ) : ticketsRemaining === 0 ? (
              'Sold Out'
            ) : (
              `Purchase ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`
            )}
          </button>

          {/* Legal Text */}
          <div className="space-y-2">
            <div className="flex items-center text-xs text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure payment processing with PayPal
            </div>
            <div className="flex items-center text-xs text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Instant raffle entry confirmation
            </div>
            <div className="flex items-center text-xs text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Support young artists and ministry work
            </div>
            <p className="text-xs text-primary-500 leading-relaxed pt-2 border-t border-primary-200">
              By purchasing tickets, you agree to our Terms of Service. Winner will be selected 
              randomly and notified via email. Includes 10% donation to FOMI ministry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaffleTicketPurchase;