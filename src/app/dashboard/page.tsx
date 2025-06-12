'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from './statCard';
import AddRestaurantForm from '../restaurant/AddRestaurantForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  getUserCount,
  getRestaurantCount,
  getMenuCount,
  getMenuItemCount,
  getRecentLogs,
} from '../../../lib/firebase';
import { toast } from 'react-hot-toast';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from 'lib/firebase';

interface Log {
  message: string;
  timestamp: {
    seconds: number;
  };
}

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  imageUrl: string;
  createdAt: {
    seconds: number;
  };
}

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, restaurants: 0, menus: 0, items: 0 });
  const [logs, setLogs] = useState<Log[]>([]);
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [users, restaurants, menus, items, recentLogs] = await Promise.all([
        getUserCount(),
        getRestaurantCount(),
        getMenuCount(),
        getMenuItemCount(),
        getRecentLogs(),
      ]);
      const snap = await getDocs(collection(db, 'restaurants'));
      const restaurantData = snap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        rating: doc.data().rating,
        imageUrl: doc.data().imageUrl,
        createdAt: doc.data().createdAt,
      })) as Restaurant[];

      setStats({ users, restaurants, menus, items });
      setLogs(recentLogs as Log[]);
      setRestaurantList(restaurantData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddRestaurant = async (restaurant: {
    name: string;
    rating: number;
    imageUrl: string;
  }) => {
    try {
      const restaurantRef = await addDoc(collection(db, 'restaurants'), {
        ...restaurant,
        createdAt: serverTimestamp(),
        createdBy: 'unknown',
      });

      await addDoc(collection(db, 'logs'), {
        message: `Created new restaurant: ${restaurant.name}`,
        timestamp: serverTimestamp(),
        adminId: 'unknown',
        restaurantId: restaurantRef.id,
        details: restaurant,
      });

      toast.success('Restaurant added successfully!');
      setOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Failed to add restaurant:', error);
      toast.error('Failed to add restaurant');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Restaurant</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a New Restaurant</DialogTitle>
              </DialogHeader>
              <AddRestaurantForm onSubmit={handleAddRestaurant} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Registered Users" value={stats.users} isLoading={isLoading} />
          <StatCard title="Restaurants" value={stats.restaurants} isLoading={isLoading} />
          <StatCard title="Menus" value={stats.menus} isLoading={isLoading} />
          <StatCard title="Menu Items" value={stats.items} isLoading={isLoading} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{log.message}</p>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp?.seconds * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4">
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Restaurants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse h-32" />
              ))
            ) : restaurantList.length > 0 ? (
              restaurantList.map((restaurant) => (
                <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                  <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Rating: {restaurant.rating}/5</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Added {new Date(restaurant.createdAt?.seconds * 1000).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No restaurants found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
