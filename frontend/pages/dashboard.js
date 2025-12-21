import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading]);

  // Fetch user data
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    fetchUserData();
  }, [isAuthenticated, token]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch tickets
      const ticketsRes = await fetch('/api/user/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData.tickets);
      }

      // Fetch history
      const historyRes = await fetch('/api/user/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData.transactions);
        setSummary(historyData.summary);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - THE FUND Gallery</title>
        <meta name="description" content="Your raffle tickets and purchase history" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-slate-50">
          {/* Header */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">
                    Welcome, {user?.firstName || 'User'}!
                  </h1>
                  <p className="text-slate-600 mt-2">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-slate-600 text-sm font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    ${summary.totalSpent.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-slate-600 text-sm font-medium">Active Tickets</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {tickets.filter(t => t.status === 'active' && t.raffle.status === 'active').length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-slate-600 text-sm font-medium">Total Tickets</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {summary.totalTickets}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex space-x-4 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('tickets')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'tickets'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Raffle Tickets
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'history'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Purchase History
              </button>
            </div>

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {loading ? (
                  <p className="text-slate-600">Loading tickets...</p>
                ) : tickets.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-slate-600 mb-4">You don't have any tickets yet</p>
                    <Link href="/raffle" className="text-blue-600 hover:underline">
                      Browse active raffles
                    </Link>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {ticket.raffle.title}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Ticket #{ticket.ticketNumber} · {ticket.entryMethod === 'paid' ? `$${ticket.raffle.ticketPrice}` : 'Free Entry'}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                            ticket.raffle.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : ticket.raffle.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.raffle.status.charAt(0).toUpperCase() + ticket.raffle.status.slice(1)}
                          </span>
                          {ticket.raffle.status === 'completed' && ticket.raffle.outcomeType && (
                            <p className="text-sm font-semibold mt-2">
                              {ticket.raffle.outcomeType === 'ARTWORK_AWARDED' ? '🎨 Artwork' : '💰 Cash Prize'}
                            </p>
                          )}
                        </div>
                      </div>
                      {ticket.raffle.status === 'active' && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-sm text-slate-600">
                            Tickets sold: {ticket.raffle.ticketsSold} / {ticket.raffle.maxTickets || '∞'}
                          </p>
                          <p className="text-sm text-slate-600">
                            Ends: {new Date(ticket.raffle.endDate).toLocaleDateString()} {new Date(ticket.raffle.endDate).toLocaleTimeString()}
                          </p>
                        </div>
                      )}
                      {ticket.raffle.status === 'completed' && (
                        <div className="mt-4">
                          <Link href={`/raffle-results?id=${ticket.raffle.id}`} className="text-blue-600 hover:underline text-sm">
                            View Results →
                          </Link>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {loading ? (
                  <p className="text-slate-600">Loading history...</p>
                ) : history.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-slate-600">No transactions yet</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Type</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Description</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Amount</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {history.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                              {transaction.type.replace(/_/g, ' ').toUpperCase()}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {transaction.raffle?.title || transaction.description || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
