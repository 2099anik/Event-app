'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

interface EventData {
  id: string;
  eventName: string;
  organizer: string;
  date: string;
  entryFee: number;
  description: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/admin/login');
    }
  }, []);
  

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    const eventsList: EventData[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<EventData, 'id'>),
    }));
    setEvents(eventsList);
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event.');
    }
  };

  const handleUpdate = (eventId: string) => {
    router.push(`/admin/updateEvent/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">All Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => router.push(`/admin/eventDetails/${event.id}`)}
            className="bg-white rounded-2xl shadow-lg p-6 relative cursor-pointer hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{event.eventName}</h2>
            <p className="text-gray-600 mb-1"><strong>Organizer:</strong> {event.organizer}</p>
            <p className="text-gray-600 mb-1"><strong>Date:</strong> {event.date}</p>
            <p className="text-gray-600 mb-1"><strong>Entry Fee:</strong> ₹{event.entryFee}</p>
            <p className="text-gray-700 mt-2 mb-4">{event.description}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering card click
                  handleUpdate(event.id);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold"
              >
                Update
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering card click
                  handleDelete(event.id);
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
