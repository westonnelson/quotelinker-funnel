'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="bg-gray-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-[#00F2F2] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Connect with a licensed insurance agent</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-[#00F2F2] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your information is secure and confidential</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-[#00F2F2] mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Over 1,000+ insurance customers helped</span>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-10 h-10 mr-2">
                <Image
                  src="/q-logo.png"
                  alt="QuoteLinker"
                  width={40}
                  height={40}
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
            <Link href="/permanent-life" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Permanent Life
            </Link>
            <Link href="/stdi" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Disability
            </Link>
            <Link href="/supplemental-health" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              Supplemental Health
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#00F2F2] transition-colors">
              About
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
                href="/permanent-life"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Permanent Life
              </Link>
              <Link 
                href="/stdi"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Disability
              </Link>
              <Link 
                href="/supplemental-health"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Supplemental Health
              </Link>
              <Link 
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#00F2F2] hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
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