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
      router.push('/crud');
    } else {
      console.error(`${isLogin ? 'Login' : 'Registration'} failed:`, data.message);
      console.error('Full error response:', data);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-4 bg-no-repeat bg-cover bg-land">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full bg-opacity-50">
        <h1 className="text-2xl text-black font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <select
                  name="role"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={toggleForm}
            className="text-black hover:underline focus:outline-none"
          >
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}