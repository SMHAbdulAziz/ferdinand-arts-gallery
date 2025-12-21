import React from 'react';
import Layout from '../components/layout/Layout';
import Head from 'next/head';

export default function RaffleProtocolsPage() {
  return (
    <Layout
      title="Raffle Protocols - THE FUND Gallery"
      description="Learn about our transparent, threshold-based raffle system designed to support emerging artists fairly."
    >
      <Head>
        <title>Raffle Protocols - THE FUND Gallery</title>
      </Head>
      
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-4xl text-primary-900 text-center mb-8">
            THE FUND Gallery Raffle Protocols
          </h1>
          
          <div className="prose prose-lg max-w-none text-primary-700">
            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded">
              <p className="text-lg font-semibold text-primary-900 mb-2">
                Artist Support Through Transparent Raffles
              </p>
              <p className="text-primary-700">
                The FUND Gallery operates raffles under a conditional threshold model designed to 
                support emerging artists while protecting all participants from financial loss.
              </p>
            </div>

            {/* Core Concept */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">Core Concept</h2>
              <p className="mb-4">
                Our raffles operate on a <strong>CONDITIONAL THRESHOLD MODEL</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Participants purchase low-cost raffle tickets</li>
                <li>A minimum number of tickets (the "Threshold") must be sold for the artwork to be awarded</li>
                <li>A winner is ALWAYS selected</li>
                <li>If the threshold is not met, the artwork is retained and the winner receives a cash prize instead</li>
              </ul>
              <p className="text-primary-600 italic">
                This ensures: no-loss protection for the artist, guaranteed outcome for participants, 
                and transparency for the public.
              </p>
            </section>

            {/* Outcome Logic */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">How Outcomes Are Determined</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Outcome A */}
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="font-bold text-green-900 mb-3 flex items-center">
                    <span className="text-2xl mr-2">✓</span>
                    Threshold Met: Artwork Awarded
                  </h3>
                  <ul className="text-sm text-green-800 space-y-2">
                    <li>• One winner is randomly selected</li>
                    <li>• Winner receives the original artwork</li>
                    <li>• Includes Certificate of Authenticity</li>
                    <li>• Artwork ownership transfers to winner</li>
                    <li>• Artwork is removed from future raffles</li>
                  </ul>
                </div>

                {/* Outcome B */}
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                    <span className="text-2xl mr-2">💰</span>
                    Threshold Not Met: Cash Prize
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• One winner is randomly selected</li>
                    <li>• Winner receives cash prize (typically 70% of pool)</li>
                    <li>• Artwork is NOT transferred</li>
                    <li>• Artwork remains for future raffle/sale</li>
                    <li>• All entry methods have equal odds</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Entry Methods */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">Entry Methods</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary-400 pl-4">
                  <h3 className="font-bold text-primary-900 mb-2">Paid Ticket Purchase</h3>
                  <p className="text-primary-700">
                    Purchase a raffle ticket via secure PayPal payment. Each ticket gives you a chance 
                    to win while directly supporting the artist.
                  </p>
                </div>

                <div className="border-l-4 border-primary-400 pl-4">
                  <h3 className="font-bold text-primary-900 mb-2">Free Email Entry</h3>
                  <p className="text-primary-700">
                    No purchase necessary. One free entry per person per raffle with identical odds 
                    of winning as paid ticket holders. Simply provide your email to enter.
                  </p>
                </div>
              </div>

              <p className="text-primary-600 italic mt-4 p-4 bg-primary-50 rounded">
                Both paid and free entries have equal probability of winning. No purchase is required 
                to enter or to win.
              </p>
            </section>

            {/* Participant Fairness */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">Fairness & Protections</h2>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span><strong>Random Selection:</strong> Winners are selected using cryptographically secure random number generation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span><strong>Equal Odds:</strong> Paid and free entries have identical odds of winning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span><strong>No Changes After Launch:</strong> Ticket price and threshold cannot change once raffle starts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span><strong>Transparent Results:</strong> All raffle outcomes are publicly disclosed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span><strong>Timestamped Entries:</strong> All entries are logged with timestamps for audit purposes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 font-bold mr-3">✓</span>
                  <span><strong>Artist Protection:</strong> Artwork may never be released below threshold</span>
                </li>
              </ul>
            </section>

            {/* How Winners Are Selected */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">Winner Selection Process</h2>
              
              <ol className="list-decimal list-inside space-y-3 text-primary-700">
                <li>
                  <strong>Pool Creation:</strong> All valid entries (paid tickets + free email entries) 
                  are combined into a single pool
                </li>
                <li>
                  <strong>Random Draw:</strong> A winner is selected using cryptographically secure 
                  random selection from the complete entry pool
                </li>
                <li>
                  <strong>Outcome Determination:</strong> The outcome (artwork awarded vs. cash prize) 
                  is determined based on whether the ticket threshold was met
                </li>
                <li>
                  <strong>Notification:</strong> The winner is notified via email with prize details
                </li>
                <li>
                  <strong>Public Announcement:</strong> Results are published on our website for transparency
                </li>
              </ol>
            </section>

            {/* No-Loss Protections */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">Artist & Gallery Protections</h2>
              
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                <p className="font-bold text-yellow-900 mb-4">The following protections ensure sustainable artist support:</p>
                <ul className="space-y-2 text-yellow-900 text-sm">
                  <li>• Artwork may never be awarded if threshold is not met</li>
                  <li>• Artist compensation is protected regardless of raffle outcome</li>
                  <li>• The gallery does not incur unrecoverable costs</li>
                  <li>• All revenue from ticket sales goes to artist or future raffle reserve</li>
                </ul>
              </div>
            </section>

            {/* Disclosure */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">Mandatory Disclosure</h2>
              
              <div className="bg-primary-50 border-2 border-primary-300 p-6 rounded-lg font-serif text-primary-900">
                <p className="mb-4">
                  This raffle operates under a minimum participation threshold. If the minimum number 
                  of entries is reached, one winner will receive the original artwork shown. If the 
                  threshold is not met, one winner will instead receive the cash prize generated by 
                  ticket sales. In all cases, a winner is guaranteed.
                </p>
                <p className="text-sm">
                  Both paid ticket purchases and free email entries have equal odds of winning. 
                  No purchase is necessary to enter or win this raffle.
                </p>
              </div>
            </section>

            {/* Contact & Questions */}
            <section className="mb-12">
              <h2 className="font-serif text-3xl text-primary-900 mb-4">Questions?</h2>
              
              <p className="text-primary-700 mb-4">
                For questions about our raffle protocols or to report concerns, contact us at:
              </p>
              
              <div className="bg-primary-50 p-4 rounded border border-primary-200">
                <p><strong>Email:</strong> <a href="mailto:info@thefundgallery.org" className="text-primary-600 hover:text-primary-700">info@thefundgallery.org</a></p>
              </div>
            </section>

            <hr className="my-12" />

            <p className="text-center text-primary-600 text-sm">
              Last updated: December 2025<br />
              Version 1.0 - Raffle Protocol Specification
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
