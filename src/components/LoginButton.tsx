'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Icon from './Icon';

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed"
        disabled
      >
        <Icon icon="fa-solid fa-spinner" className="animate-spin" size={14} />
        <span className="hidden sm:inline">Loading...</span>
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-7 h-7 rounded-full border-2 border-gray-300"
            />
          )}
          <span className="text-xs hidden sm:inline max-w-[100px] truncate">
            {session.user?.name}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
          title="Sign Out"
        >
          <Icon icon="fa-solid fa-right-from-bracket" size={14} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-white hover:bg-gray-100 transition-colors text-gray-900 border border-gray-300"
      title="Sign in with Google"
    >
      <Icon icon="fa-brands fa-google" size={14} />
      <span className="hidden sm:inline">Sign in</span>
    </button>
  );
}
