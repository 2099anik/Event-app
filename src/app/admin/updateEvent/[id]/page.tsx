'use client';
export const dynamic = 'force-dynamic';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function UpdateEventPage() {
  const router = useRouter();
  const { id } = useParams(); // get dynamic ID from URL

  const [form, setForm] = useState({
    eventName: '',
    organizer: '',
    date: '',
    entryFee: '',
    description: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, 'events', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm({
          eventName: data.eventName,
          organizer: data.organizer,
          date: data.date,
          entryFee: data.entryFee.toString(),
          description: data.description,
        });
      } else {
        alert('Event not found');
        router.push('/admin/adminEvents');
      }
    };

    if (id) fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'events', id as string);
      await updateDoc(docRef, {
        eventName: form.eventName,
        organizer: form.organizer,
        date: form.date,
        entryFee: Number(form.entryFee),
        description: form.description,
      });
      alert('Event updated successfully!');
      router.push('/admin/adminEvents');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Update Event</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-50 p-6 rounded-2xl shadow-lg">
        <input id="eventName" value={form.eventName} onChange={handleChange} placeholder="Event Name" required className="w-full p-3 mb-4 border rounded-lg" />
        <input id="organizer" value={form.organizer} onChange={handleChange} placeholder="Organizer" required className="w-full p-3 mb-4 border rounded-lg" />
        <input id="date" type="date" value={form.date} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-lg" />
        <input id="entryFee" type="number" value={form.entryFee} onChange={handleChange} placeholder="Entry Fee" required className="w-full p-3 mb-4 border rounded-lg" />
        <textarea id="description" value={form.description} onChange={handleChange} placeholder="Description" rows={4} required className="w-full p-3 mb-6 border rounded-lg"></textarea>

        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
          Save Changes
        </button>
      </form>
    </div>
  );
}
