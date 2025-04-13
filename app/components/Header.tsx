'use client'

import Link from 'next/link'
import { LinkIcon, Bars3Icon } from '@heroicons/react/24/solid'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <LinkIcon className="h-8 w-8 text-[#00F2F2] mr-2" />
              <span className="text-xl font-semibold text-gray-900">QuoteLinker</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/term-life" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Term Life
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Whole Life
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              About Us
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Contact
            </Link>
            <Link 
              href="/term-life" 
              className="bg-[#00F2F2] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#00D6D6] transition-all hover-neon"
            >
              Get Quote
            </Link>
          </div>

          <button className="md:hidden">
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </nav>
    </header>
  )
} 