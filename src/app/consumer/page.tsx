'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface EventData {
  id: string;
  eventName: string;
  organizer: string;
  date: string;
  entryFee: number;
  description: string;
  participants?: { phone: string }[];
}

export default function ConsumerEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const router = useRouter();

  // Get phone of the user who joined (set during form submission)
  const joinedPhone =
    typeof window !== 'undefined' ? localStorage.getItem('joinedPhone') : null;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    const eventsList: EventData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<EventData, 'id'> & { participants?: { phone: string }[] };
      return {
        id: doc.id,
        ...data,
        participants: data.participants || [],
      };
    });
    setEvents(eventsList);
  };

  const redirectToJoinPage = (eventId: string) => {
    router.push(`/consumerDetails/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Upcoming Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const alreadyJoined = event.participants?.some(
            (p) => p.phone === joinedPhone
          );

          return (
            <div key={event.id} className="bg-white rounded-2xl shadow-lg p-6 relative">
              <div className="absolute top-3 right-3 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                ₹{event.entryFee}
              </div>

              <h2 className="text-xl font-semibold text-blue-700 mb-2">{event.eventName}</h2>
              <p className="text-gray-600 mb-1"><strong>Organizer:</strong> {event.organizer}</p>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {event.date}</p>
              <p className="text-gray-700 mt-2 mb-6">{event.description}</p>

              <button
                onClick={() => redirectToJoinPage(event.id)}
                disabled={alreadyJoined}
                className={`w-full py-2 ${
                  alreadyJoined
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white rounded-md font-semibold transition duration-200`}
              >
                {alreadyJoined ? 'Joined' : 'Join Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
