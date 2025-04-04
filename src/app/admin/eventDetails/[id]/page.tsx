'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface Participant {
  name: string;
  age: string;
  phone: string;
  email: string;
}

interface EventData {
  eventName: string;
  organizer: string;
  date: string;
  entryFee: number;
  description: string;
  participants?: Participant[];
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = docSnap.data() as EventData;
          setEvent(eventData);
        } else {
          alert('Event not found!');
          router.push('/admin/adminEvents');
        }
      } catch (err) {
        console.error('Failed to fetch event:', err);
        alert('Something went wrong.');
      }
    };

    fetchEvent();
  }, [id, router]);

  if (!event) return <div className="p-6">Loading event details...</div>;

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {event.eventName}
        </h1>

        <div className="space-y-2 text-gray-700 mb-8">
          <p><strong>Organizer:</strong> {event.organizer}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Entry Fee:</strong> ₹{event.entryFee}</p>
          <p><strong>Description:</strong> {event.description}</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Participants</h2>

        {event.participants && event.participants.length > 0 ? (
          <ul className="space-y-4">
            {event.participants.map((p, index) => (
              <li
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <p><strong>Name:</strong> {p.name}</p>
                <p><strong>Age:</strong> {p.age}</p>
                <p><strong>Phone:</strong> {p.phone}</p>
                <p><strong>Email:</strong> {p.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No participants have joined yet.</p>
        )}
      </div>
    </div>
  );
}
