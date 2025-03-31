'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinkClasses = (href: string) =>
    clsx(
      "inline-flex items-center px-4 py-2 rounded-md transition-all duration-300 ease-in-out hover:underline focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-blue-200",
      {
        'font-bold': pathname === href,
      }
    );

  return (
    <header className="bg-cyan-200 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center" aria-label="Main Navigation">
        <Link href="/" className="flex items-center space-x-2" aria-label="Go to home page">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-2xl font-bold">佐藤さんの憂鬱</span>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/blog" className={navLinkClasses('/blog')}>
              一覧
            </Link>
          </li>
          {session ? (
            <>
              <li>
                <Link href="/blog/new" className={navLinkClasses('/blog/new')}>
                  新規作成
                </Link>
              </li>
              <li>
                <Link href="/profile" className={navLinkClasses('/profile')}>
                  マイページ
                </Link>
              </li>
              <li>
                <button onClick={() => signOut()} className="hover:underline">
                  ログアウト
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/auth/signin"
                  className={navLinkClasses('/auth/signin')}
                >
                  ログイン
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className={navLinkClasses('/auth/signup')}
                >
                  新規登録
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}