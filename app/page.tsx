"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const username = isLogin ? '' : (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const role = isLogin ? '' : (form.elements.namedItem('role') as HTMLSelectElement).value;

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log(`${isLogin ? 'Login' : 'Registration'} successful:`, data);
      router.push('/welcome');
    } else {
      console.error(`${isLogin ? 'Login' : 'Registration'} failed:`, data.message);
      console.error('Full error response:', data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl mb-4">{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 border border-gray-300 rounded"
          required
        />
        {!isLogin && (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <select
              name="role"
              className="p-2 border border-gray-300 rounded"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button onClick={toggleForm} className="mt-4 text-blue-500">
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
}