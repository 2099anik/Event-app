'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { db } from '../../../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

interface EventData {
  eventName: string;
  organizer: string;
  date: string;
  entryFee: number;
  description: string;
}

export default function ConsumerDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent(docSnap.data() as EventData);
        } else {
          alert('Event not found');
          router.push('/consumer');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        alert('Failed to load event.');
      }
    };

    fetchEvent();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventRef = doc(db, 'events', id as string);

      // ✅ Save the participant in Firestore
      await updateDoc(eventRef, {
        participants: arrayUnion(formData),
      });

      // ✅ Save phone locally to disable "Join Now" on /consumer page
      localStorage.setItem('joinedPhone', formData.phone);

      alert(`🎉 ${formData.name}, you have successfully joined the event!`);
      router.push('/consumer');
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join. Please try again.');
    }
  };

  if (!event) return <div className="p-6">Loading event...</div>;

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Join: {event.eventName}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-50 p-6 rounded-2xl shadow-lg"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          type="number"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          type="tel"
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          type="email"
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg"
        />

        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Join Event
        </button>
      </form>
    </div>
  );
}
