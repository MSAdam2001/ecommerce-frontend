'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <span className="text-gray-500 text-sm">{users.length} total users</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 text-gray-500 font-medium">Name</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Email</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Role</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Joined</th>
                    <th className="text-left py-3 text-gray-500 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-gray-600">{user.email}</td>
                      <td className="py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium"
                          style={user.role === 'admin'
                            ? { background: '#FFF3E0', color: '#E65100' }
                            : { background: '#E3F2FD', color: '#1565C0' }
                          }>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
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
      </div>
    </div>
  );
}