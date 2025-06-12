'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from 'lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  imageUrl: string;
  createdAt?: {
    seconds: number;
  };
  createdBy?: string;
}

interface FormData {
  name: string;
  rating: string;
  imageUrl: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  basePrice?: number;
  category?: string;
  inStock?: boolean;
  optionPrices?: any;
  options?: any;
}

const RestaurantDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<FormData>({ name: '', rating: '', imageUrl: '' });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const docRef = doc(db, 'restaurants', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setRestaurant({ id: snapshot.id, ...data } as Restaurant);
          setForm({
            name: data.name || '',
            rating: data.rating?.toString() || '',
            imageUrl: data.imageUrl || ''
          });
        }
        // Fetch menu items
        const menuSnap = await getDocs(collection(db, 'restaurants', id, 'menus'));
        const menuData = menuSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Unnamed Item',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            basePrice: data.basePrice || 0,
            category: data.category || '',
            inStock: data.inStock !== undefined ? data.inStock : true,
            optionPrices: data.optionPrices || {},
            options: data.options || [],
          };
        });
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast.error('Failed to fetch restaurant details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'restaurants', id);
      await updateDoc(docRef, {
        name: form.name,
        rating: parseFloat(form.rating),
        imageUrl: form.imageUrl,
        updatedAt: new Date()
      });
      setRestaurant(prev => prev ? {
        ...prev,
        name: form.name,
        rating: parseFloat(form.rating),
        imageUrl: form.imageUrl
      } : null);
      toast.success('Restaurant updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating restaurant:', err);
      toast.error('Failed to update restaurant');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) return <div className="max-w-3xl mx-auto px-4 py-8">Restaurant not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline">&larr; Back to Dashboard</Button>
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6">Restaurant Details</h1>
      {isEditing ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input 
              id="name"
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Enter restaurant name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input 
              id="rating"
              name="rating" 
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating} 
              onChange={handleChange} 
              placeholder="Enter rating (0-5)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input 
              id="imageUrl"
              name="imageUrl" 
              type="url"
              value={form.imageUrl} 
              onChange={handleChange} 
              placeholder="Enter image URL"
              required
              pattern="https?://.+"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdate}>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium">{restaurant.name}</p>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-lg font-medium">{restaurant.rating}/5</p>
            </div>
            <Button className="mt-6" onClick={() => setIsEditing(true)}>Edit Restaurant</Button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Menus</h2>
        {menuItems.length === 0 ? (
          <p className="text-gray-500">No menu items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                {item.description && <p className="text-sm text-gray-600 mb-2">{item.description}</p>}
                {item.basePrice !== undefined && <p className="text-sm text-gray-800">Price: ${item.basePrice}</p>}
                {item.category && <p className="text-xs text-gray-500">Category: {item.category}</p>}
                {item.inStock !== undefined && (
                  <p className={`text-xs ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>{item.inStock ? 'In Stock' : 'Out of Stock'}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailsPage; 