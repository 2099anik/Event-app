'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/admin/login');
    }
  }, []);
  
  // Form state
  const [eventName, setEventName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'events'), {
        eventName,
        organizer,
        date,
        entryFee: Number(entryFee),
        description,
        createdAt: new Date(),
      });

      router.push('/admin/adminEvents');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ NAVBAR */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <Link
          href="/admin/adminEvents"
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          View All Events
        </Link>
      </nav>

      {/* ✅ FORM */}
      <div className="flex flex-col justify-center items-center py-10 px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Create New Event</h2>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-50 p-6 rounded-2xl shadow-lg"
        >
          <div className="mb-4">
            <label htmlFor="eventName" className="block mb-2 text-sm font-semibold text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="organizer" className="block mb-2 text-sm font-semibold text-gray-700">
              Organizer Name
            </label>
            <input
              type="text"
              id="organizer"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 text-sm font-semibold text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="entryFee" className="block mb-2 text-sm font-semibold text-gray-700">
              Entry Fee (₹)
            </label>
            <input
              type="number"
              id="entryFee"
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 text-sm font-semibold text-gray-700">
              Event Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
