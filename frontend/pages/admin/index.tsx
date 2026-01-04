import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

// Simple admin layout without the main site header/footer
const AdminLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
  <div className="min-h-screen bg-gray-100">
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">THE FUND Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
            )}
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              View Site
            </Link>
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  </div>
  );
};

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalRaffles: 0,
    activeRaffles: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    ferdinandFund: 0,
    ferdinandFundTarget: 269000
  });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [fundGoalEdit, setFundGoalEdit] = useState('269000');
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch dashboard data
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentTickets(data.recentTickets);
        setFundGoalEdit(data.stats.ferdinandFundTarget.toString());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const handleSaveFundGoal = async () => {
    const newGoal = parseFloat(fundGoalEdit);
    if (isNaN(newGoal) || newGoal <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'fund_goals',
          value: {
            ferdinand_fund_target: newGoal
          },
          description: "Ferdinand's education fund goals"
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update local stats
        setStats(prev => ({ ...prev, ferdinandFundTarget: newGoal }));
        setShowGoalEditor(false);
        alert('Fund goal updated successfully');
      }
    } catch (error) {
      console.error('Failed to save fund goal:', error);
      alert('Failed to save fund goal');
    }
  };

  const fundProgress = (stats.ferdinandFund / stats.ferdinandFundTarget) * 100;

  // Show loading state
  if (loading) {
    return (
      <AdminLayout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  // Don't render if not authenticated or not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loadingDashboard) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Raffles</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.activeRaffles}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tickets Sold</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalTicketsSold}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${stats.totalRevenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ferdinand's Fund</dt>
                  <dd className="text-lg font-medium text-gray-900">${stats.ferdinandFund.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ferdinand's Fund Progress */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Ferdinand's Education Fund Progress</h3>
          <button
            onClick={() => setShowGoalEditor(!showGoalEditor)}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showGoalEditor ? 'Cancel' : 'Edit Goal'}
          </button>
        </div>
        
        {showGoalEditor && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <input
                type="number"
                value={fundGoalEdit}
                onChange={(e) => setFundGoalEdit(e.target.value)}
                placeholder="Enter goal amount"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveFundGoal}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress toward ${stats.ferdinandFundTarget.toLocaleString()} goal</span>
            <span className="font-semibold">{fundProgress.toFixed(1)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-purple-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${fundProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>$0</span>
            <span>${stats.ferdinandFundTarget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Ticket Purchases */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Ticket Purchases</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{ticket.email}</p>
                    <p className="text-sm text-gray-600">{ticket.raffle} • {ticket.tickets} ticket{ticket.tickets > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${ticket.amount}</p>
                    <p className="text-sm text-gray-600">{ticket.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 text-center">
            <Link href="/admin/tickets" className="text-sm text-blue-600 hover:text-blue-800">
              View all tickets →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <Link 
              href="/admin/raffles/new"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-center block"
            >
              Create New Raffle
            </Link>
            <Link 
              href="/admin/artworks/new"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-center block"
            >
              Add New Artwork
            </Link>
            <Link 
              href="/admin/raffles"
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 text-center block"
            >
              Manage Raffles
            </Link>
            <Link 
              href="/admin/users"
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 text-center block"
            >
              View Users
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;