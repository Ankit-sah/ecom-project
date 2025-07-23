"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface HeroSectionProps {
  onShowLogin?: () => void;
  onHideLogin?: () => void;
}

async function handleLogout() {
  await signOut();
  const baseUrl = process.env.NEXT_PUBLIC_AUTH0_URL;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const logoutUrl = `${baseUrl}v2/logout?returnTo=${window.location.origin}&client_id=${clientId}`;
  window.location.replace(logoutUrl ?? "/");
}

export default function HeroSection({ onShowLogin, onHideLogin }: HeroSectionProps) {
  const { data: session, status } = useSession();

  return (
    <div className="bg-white">
      <header className="p-6 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">E-Shop</h1>

        <nav className="space-x-4">
          <Link href="/admin/products" className="text-gray-700 hover:underline">
            Shop
          </Link>
          <Link href="/" className="text-gray-700 hover:underline">
            Dashboard
          </Link>
          <Link href="/" className="text-gray-700 hover:underline">
            Cart
          </Link>
          <Link href="/admin" className="text-gray-700 hover:underline">
            Admin
          </Link>
        </nav>

        <div>
          {status === "loading" ? (
            <p>Loading...</p>
          ) : session ? (
            <div className="flex items-center space-x-4">
              <p className="text-gray-800">Hi, {session.user?.name || session.user?.email}</p>
              <button
                onClick={() => {
                  handleLogout()
                  if (onHideLogin) onHideLogin();
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onShowLogin) onShowLogin();
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Log in
            </button>
          )}
        </div>
      </header>

      {/* Hero content - only shown on home page */}
      <main className="py-16 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Your dream products, all in one place.</h2>
        <p className="max-w-xl text-gray-600 mb-6">
          Discover our carefully curated collection of fashion, electronics, and home goods. Fast delivery and quality guaranteed.
        </p>
        <Link
          href="/products"
          className="rounded-md bg-indigo-600 px-6 py-3 text-white text-lg font-semibold hover:bg-indigo-500"
        >
          Shop Now
        </Link>
      </main>
    </div>
  );
}