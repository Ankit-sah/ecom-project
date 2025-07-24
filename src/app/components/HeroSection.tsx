"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { ShoppingCartIcon, UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

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
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
            E-Shop
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/admin/products" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Shop
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium flex items-center">
              <ShoppingCartIcon className="h-5 w-5 mr-1" />
              Cart
            </Link>
            
              <Link href="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                Admin
              </Link>
            
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-gray-800 font-medium">
                    {JSON.stringify(session?.user?.id)}
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                </div>
                <Button
                  onClick={() => {
                    handleLogout();
                    if (onHideLogin) onHideLogin();
                  }}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  if (onShowLogin) onShowLogin();
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 text-center max-w-7xl mx-auto w-full py-12 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Your dream products, all in one place.
        </h1>
        <p className="max-w-2xl text-lg text-gray-600 mb-8">
          Discover our carefully curated collection of fashion, electronics, and home goods. 
          Fast delivery and quality guaranteed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-white text-lg font-semibold hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Shop Now
          </Link>
          {!session && (
            <Button
              onClick={() => onShowLogin?.()}
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-indigo-600 text-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm ring-1 ring-inset ring-gray-300"
            >
              Create Account
            </Button>
          )}
        </div>
      </main>

      {/* Mobile Navigation (optional) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <Link href="/admin/products" className="p-2 text-gray-700 hover:text-indigo-600">
            <ShoppingCartIcon className="h-6 w-6 mx-auto" />
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link href="/dashboard" className="p-2 text-gray-700 hover:text-indigo-600">
            <UserIcon className="h-6 w-6 mx-auto" />
            <span className="text-xs mt-1">Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}