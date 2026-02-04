import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { adminAPI, setAuthToken } from '../lib/api';

function Admin() {
    const { getToken, user } = useAuth();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPremium, setFilterPremium] = useState('all'); // 'all', 'premium', 'free'

    // Modal state
    const [showStoriesModal, setShowStoriesModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userStories, setUserStories] = useState([]);
    const [loadingStories, setLoadingStories] = useState(false);

    useEffect(() => {
        checkAdminAndLoadData();
    }, []);

    const checkAdminAndLoadData = async () => {
        try {
            const token = await getToken();
            setAuthToken(token);

            // Check if user is admin
            const adminCheck = await adminAPI.checkAdmin();
            setIsAdmin(adminCheck.isAdmin);

            if (adminCheck.isAdmin) {
                // Load data
                await Promise.all([loadUsers(), loadStats()]);
            }
        } catch (error) {
            console.error('Admin check failed:', error);
            if (error.response?.status === 403) {
                alert('Access Denied: You do not have admin privileges');
                navigate('/dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const data = await adminAPI.getAllUsers();
            setUsers(data.users);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    const loadStats = async () => {
        try {
            const data = await adminAPI.getStats();
            setStats(data.stats);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const togglePremium = async (userId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await adminAPI.togglePremium(userId, newStatus);

            // Update local state
            setUsers(users.map(u =>
                u.id === userId
                    ? { ...u, isPremium: newStatus, subscriptionType: newStatus ? 'unlimited' : 'free' }
                    : u
            ));

            // Reload stats
            await loadStats();

            alert(`Premium ${newStatus ? 'approved' : 'revoked'} successfully!`);
        } catch (error) {
            console.error('Failed to toggle premium:', error);
            alert('Failed to update premium status');
        }
    };

    const viewUserStories = async (user) => {
        try {
            setSelectedUser(user);
            setShowStoriesModal(true);
            setLoadingStories(true);

            const data = await adminAPI.getUserStories(user.id);
            setUserStories(data.stories);
        } catch (error) {
            console.error('Failed to load user stories:', error);
            alert('Failed to load stories');
        } finally {
            setLoadingStories(false);
        }
    };

    const exportToCSV = () => {
        const csvHeaders = ['Name', 'Email', 'Stories Generated', 'Premium Status', 'Subscription Type', 'Registration Date'];
        const csvData = filteredUsers.map(user => [
            user.name,
            user.email,
            user.storiesGenerated,
            user.isPremium ? 'Yes' : 'No',
            user.subscriptionType,
            new Date(user.createdAt).toLocaleDateString()
        ]);

        const csvContent = [
            csvHeaders.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        alert(`Exported ${filteredUsers.length} users to CSV!`);
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterPremium === 'all'
            ? true
            : filterPremium === 'premium'
                ? user.isPremium
                : !user.isPremium;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-8 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl font-bold text-gray-700">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center">
                <motion.div
                    className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-8xl mb-6">🚫</div>
                    <h1 className="text-3xl font-display font-black text-gray-800 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You do not have permission to access the admin panel.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-bold hover:scale-105 transition-all"
                    >
                        Go to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
            {/* Navigation */}
            <nav className="bg-white/90 backdrop-blur-lg border-b-4 border-primary/30 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">👑</span>
                            <div>
                                <h1 className="text-2xl font-display font-extrabold text-gradient-fun">Admin Panel</h1>
                                <p className="text-sm text-gray-600">User & Payment Management</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 bg-gradient-to-r from-bubble to-ocean text-white rounded-full font-bold hover:scale-105 transition-all"
                            >
                                📚 Dashboard
                            </button>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-lg border-3 border-blue-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="text-3xl mb-2">👥</div>
                            <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                            <p className="text-3xl font-black text-blue-600">{stats.totalUsers}</p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-lg border-3 border-purple-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-3xl mb-2">💎</div>
                            <p className="text-gray-600 text-sm font-semibold">Premium Users</p>
                            <p className="text-3xl font-black text-purple-600">{stats.premiumUsers}</p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-lg border-3 border-green-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="text-3xl mb-2">🆓</div>
                            <p className="text-gray-600 text-sm font-semibold">Free Users</p>
                            <p className="text-3xl font-black text-green-600">{stats.freeUsers}</p>
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-lg border-3 border-pink-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="text-3xl mb-2">📚</div>
                            <p className="text-gray-600 text-sm font-semibold">Total Stories</p>
                            <p className="text-3xl font-black text-pink-600">{stats.totalStories}</p>
                        </motion.div>
                    </div>
                )}

                {/* User Management Section */}
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl border-4 border-primary/30 overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="bg-gradient-to-r from-primary to-accent p-6">
                        <h2 className="text-2xl font-display font-black text-white">User Management</h2>
                        <p className="text-white/90">Manage premium access for all users</p>
                    </div>

                    {/* Search, Filter, and Export */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="🔍 Search by email or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <select
                                value={filterPremium}
                                onChange={(e) => setFilterPremium(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="all">All Users</option>
                                <option value="premium">Premium Only</option>
                                <option value="free">Free Only</option>
                            </select>
                            <button
                                onClick={exportToCSV}
                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:scale-105 transition-all flex items-center gap-2"
                            >
                                📥 Export CSV
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">Showing {filteredUsers.length} of {users.length} users</p>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Stories</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-lg font-bold text-primary">{user.storiesGenerated}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {user.isPremium ? (
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    💎 Premium
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    🆓 Free
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    onClick={() => viewUserStories(user)}
                                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold text-xs hover:scale-105 transition-all"
                                                    title="View Stories"
                                                >
                                                    📚 View
                                                </button>
                                                <button
                                                    onClick={() => togglePremium(user.id, user.isPremium)}
                                                    className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all hover:scale-105 ${user.isPremium
                                                        ? 'bg-gradient-to-r from-red-400 to-red-500 text-white'
                                                        : 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                                                        }`}
                                                >
                                                    {user.isPremium ? '❌ Revoke' : '✅ Approve'}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🔍</div>
                                <p className="text-gray-600 text-lg">No users found</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* User Stories Modal */}
            {showStoriesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary to-accent p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-display font-black text-white">
                                    {selectedUser?.name}'s Stories
                                </h3>
                                <p className="text-white/90 text-sm">{selectedUser?.email}</p>
                            </div>
                            <button
                                onClick={() => setShowStoriesModal(false)}
                                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {loadingStories ? (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading stories...</p>
                                </div>
                            ) : userStories.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📚</div>
                                    <p className="text-gray-600 text-lg">No stories yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userStories.map((story, index) => (
                                        <motion.div
                                            key={story.id}
                                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-800">
                                                        {story.childName}'s Adventure
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        with {story.favoriteAnimal} • {story.moralLesson}
                                                    </p>
                                                </div>
                                                <span className="text-xs bg-purple-200 px-3 py-1 rounded-full font-semibold">
                                                    {story.readingTime} min read
                                                </span>
                                            </div>
                                            <p className="text-gray-700 text-sm mb-3">
                                                {story.preview}
                                            </p>
                                            <div className="text-xs text-gray-500">
                                                Created: {new Date(story.createdAt).toLocaleString()}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default Admin;
