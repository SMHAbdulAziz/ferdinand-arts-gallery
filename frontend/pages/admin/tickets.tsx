import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

interface Ticket {
  id: string;
  raffle_id: string;
  user_id: string;
  ticket_number: number;
  purchase_date: string;
  status: string;
  raffle_title?: string;
  user_email?: string;
}

const AdminTicketsPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRaffle, setFilterRaffle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch tickets
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('/api/admin/tickets');
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesRaffle = !filterRaffle || ticket.raffle_id === filterRaffle;
    const matchesStatus = !filterStatus || ticket.status === filterStatus;
    return matchesRaffle && matchesStatus;
  });

  return (
    <Layout title="Manage Tickets - Admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Manage Tickets</h1>
            <p className="text-gray-600 mt-2">View and manage all raffle ticket purchases</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="refunded">Refunded</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${filteredTickets.length} Tickets`}
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p>No tickets found matching your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ticket #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Raffle</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Purchase Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">#{ticket.ticket_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{ticket.user_email || 'Unknown'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{ticket.raffle_title || 'Unknown'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(ticket.purchase_date)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link href="/admin">
              <a className="text-primary-600 hover:text-primary-700 font-semibold">
                ← Back to Admin Dashboard
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminTicketsPage;
