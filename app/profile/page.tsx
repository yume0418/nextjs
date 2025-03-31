'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        setMessage('Profile updated successfully');
      } else {
        const data = await response.json();
        setMessage(data.error || 'An error occurred while updating the profile');
      }
    } catch (error: unknown) { // errorをunknown型として受け取る
      if (error instanceof Error) {
        setMessage('An error occurred while updating the profile: ' + error.message);
      } else {
        setMessage('An unknown error occurred while updating the profile.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="p-24">
      <h1 className="text-2xl font-bold mb-4">ブログや筆者の簡単な紹介ページ</h1>
    </div>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
}
