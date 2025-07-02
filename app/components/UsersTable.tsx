'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/app/lib/client';

export interface UserWithAmount {
  email: string;
  name: string;
  totalOwed: number;
  bookingCount: number;
}

export default function UsersTable() {
  const [users, setUsers] = useState<UserWithAmount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchUsersRef = useRef<() => void>(undefined);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/admin-users-with-amounts');
      if (!res.ok) throw new Error('Failed to fetch users');
      const userData = await res.json();
      setUsers(userData);
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Store fetchUsers in a ref so the realtime callback always has the latest
  fetchUsersRef.current = fetchUsers;

  useEffect(() => {
    fetchUsers();

    const supabase = createClient();

    // Listen for changes in bookings table
    const bookingsSub = supabase.channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          if (fetchUsersRef.current) fetchUsersRef.current();
        }
      )
      .subscribe();

    // Listen for changes in auth.users table
    const usersSub = supabase.channel('users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'auth',
          table: 'users',
        },
        () => {
          if (fetchUsersRef.current) fetchUsersRef.current();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsSub);
      supabase.removeChannel(usersSub);
    };
  }, []);
 
  const handleRefresh = fetchUsers;

  // Calculate total outstanding (same as total amount owed from all users)
  const totalOutstanding = users.reduce((sum, user) => sum + user.totalOwed, 0);

  if (isLoading) {
    return (
      <div className="glass-card">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white font-['Poppins']">Users & Outstanding Amounts</h3>
            <button
              onClick={handleRefresh}
              className="text-blue-400 hover:text-blue-300 text-sm font-['Poppins']"
            >
              Refresh
            </button>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="text-white/70 font-['Poppins']">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white font-['Poppins']">Users & Outstanding Amounts</h3>
            <button
              onClick={handleRefresh}
              className="text-blue-400 hover:text-blue-300 text-sm font-['Poppins']"
            >
              Refresh
            </button>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="text-red-400 font-['Poppins']">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card"
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white font-['Poppins']">Users & Outstanding Amounts</h3>
          <button
            onClick={handleRefresh}
            className="text-blue-400 hover:text-blue-300 text-sm font-['Poppins'] transition-colors"
          >
            Refresh
          </button>
        </div>
        
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-white/70 font-['Poppins']">No users found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-2 text-white/80 font-medium text-sm font-['Poppins']">
                    Name
                  </th>
                  <th className="text-left py-3 px-2 text-white/80 font-medium text-sm font-['Poppins']">
                    Email
                  </th>
                  <th className="text-right py-3 px-2 text-white/80 font-medium text-sm font-['Poppins']">
                    Sessions
                  </th>
                  <th className="text-right py-3 px-2 text-white/80 font-medium text-sm font-['Poppins']">
                    Amount Owed
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2 text-white font-['Poppins']">
                      {user.name}
                    </td>
                    <td className="py-3 px-2 text-white/80 text-sm font-['Poppins']">
                      {user.email}
                    </td>
                    <td className="py-3 px-2 text-right text-white/80 text-sm font-['Poppins']">
                      {user.bookingCount}
                    </td>
                    <td className="py-3 px-2 text-right text-white font-semibold font-['Poppins']">
                      ${user.totalOwed.toFixed(2)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {users.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex justify-between items-center text-white/80 font-['Poppins']">
              <span className="text-sm">Total Users: {users.length}</span>
              <span className="text-sm">
                Total Outstanding: ${totalOutstanding.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
} 