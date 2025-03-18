'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Navigation() {
  const pathname = usePathname();

  const navLinkClasses = (href: string) =>
    clsx('hover:underline', {
      'font-bold': pathname === href
    });

  return (
    <header className="bg-sky-200 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="My Blog Logo" width={40} height={40} />
          <span className="text-2xl font-bold">佐藤の憂鬱</span>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/blog"
              className={navLinkClasses('/blog')}
            >
              一覧
            </Link>
          </li>
          <li>
            <Link
              href="/blog/new"
              className={navLinkClasses('/blog/new')}
            >
              新規作成
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}