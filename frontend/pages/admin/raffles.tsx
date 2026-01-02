import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

interface Raffle {
  id: string;
  title: string;
  status: string;
  tickets_sold: number;
  max_tickets: number;
  start_date: string;
  end_date: string;
}

const AdminRafflesPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticket_price: 25,
    max_tickets: 100,
    minimum_threshold_tickets: 50,
    status: 'scheduled',
    start_date: '',
    end_date: '',
    artwork_id: '',
    cash_prize_percentage: 30
  });

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch raffles
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchRaffles();
    }
  }, [user]);

  const fetchRaffles = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/admin/raffles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setRaffles(data.raffles);
      }
    } catch (error) {
      console.error('Failed to fetch raffles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') || name.includes('tickets') || name.includes('percentage') 
        ? parseInt(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `/api/admin/raffles/${editingId}`
        : '/api/admin/raffles';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        fetchRaffles();
        resetForm();
        alert(editingId ? 'Raffle updated!' : 'Raffle created!');
      } else {
        // Show detailed error message if available
        const errorMsg = data.details ? `${data.error}\n\n${data.details}` : (data.error || 'Failed to save raffle');
        alert(errorMsg);
      }
    } catch (error) {
      alert('Error saving raffle');
      console.error(error);
    }
  };

  const handleStatusChange = async (raffleId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/raffles/${raffleId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        fetchRaffles();
        alert(`Raffle status updated to ${newStatus}!`);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('Error updating status');
      console.error(error);
    }
  };

  const handleDelete = async (raffleId: string) => {
    if (!confirm('Are you sure you want to delete this raffle?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/raffles/${raffleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        fetchRaffles();
        alert('Raffle deleted!');
      } else {
        alert(data.error || 'Failed to delete raffle');
      }
    } catch (error) {
      alert('Error deleting raffle');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      ticket_price: 25,
      max_tickets: 100,
      minimum_threshold_tickets: 50,
      status: 'scheduled',
      start_date: '',
      end_date: '',
      artwork_id: '',
      cash_prize_percentage: 30
    });
    setEditingId(null);
    setShowNewForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
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

  return (
    <Layout title="Manage Raffles - Admin">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Manage Raffles</h1>
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold"
            >
              {showNewForm ? '✕ Cancel' : '+ New Raffle'}
            </button>
          </div>

          {/* New/Edit Form */}
          {showNewForm && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Raffle' : 'Create New Raffle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Playful Giraffe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Price ($)
                    </label>
                    <input
                      type="number"
                      name="ticket_price"
                      value={formData.ticket_price}
                      onChange={handleInputChange}
                      min="1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Tickets
                    </label>
                    <input
                      type="number"
                      name="max_tickets"
                      value={formData.max_tickets}
                      onChange={handleInputChange}
                      min="1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Threshold Tickets
                    </label>
                    <input
                      type="number"
                      name="minimum_threshold_tickets"
                      value={formData.minimum_threshold_tickets}
                      onChange={handleInputChange}
                      min="1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cash Prize % (if threshold not met)
                    </label>
                    <input
                      type="number"
                      name="cash_prize_percentage"
                      value={formData.cash_prize_percentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artwork ID
                    </label>
                    <input
                      type="text"
                      name="artwork_id"
                      value={formData.artwork_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Link to artwork"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Raffle description"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-8 py-2 rounded-lg hover:bg-primary-700 font-semibold"
                  >
                    {editingId ? 'Update Raffle' : 'Create Raffle'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-800 px-8 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Raffles List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {loading ? 'Loading...' : `${raffles.length} Raffles`}
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : raffles.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                <p>No raffles yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tickets</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dates</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {raffles.map((raffle) => (
                      <tr key={raffle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">{raffle.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(raffle.status)}`}>
                            {raffle.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {raffle.tickets_sold} / {raffle.max_tickets}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div>{formatDate(raffle.start_date)}</div>
                          <div className="text-xs text-gray-500">to {formatDate(raffle.end_date)}</div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm space-x-2">
                          {raffle.status !== 'active' && (
                            <button
                              onClick={() => handleStatusChange(raffle.id, 'active')}
                              className="text-green-600 hover:text-green-800 font-semibold"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingId(raffle.id);
                              setShowNewForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(raffle.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
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

export default AdminRafflesPage;
