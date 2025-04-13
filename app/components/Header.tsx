'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src="/q-logo.png"
                  alt="QuoteLinker"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">QuoteLinker</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/term-life" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Term Life
            </Link>
            <Link href="/whole-life" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Whole Life
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Contact
            </Link>
            <Link 
              href="/term-life" 
              className="bg-[#00F2F2] text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-[#00D6D6] transition-all hover-neon"
            >
              Get Quote
            </Link>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/term-life"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Term Life
              </Link>
              <Link 
                href="/whole-life"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Whole Life
              </Link>
              <Link 
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/term-life"
                className="block px-3 py-2 rounded-md text-base font-medium bg-[#00F2F2] text-gray-900 hover:bg-[#00D6D6]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 