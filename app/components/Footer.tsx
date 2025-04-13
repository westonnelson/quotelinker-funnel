'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src="/q-logo.png"
                  alt="QuoteLinker"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">QuoteLinker</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Making insurance simple, affordable, and accessible for everyone.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00F2F2]">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00F2F2]">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00F2F2]">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/term-life" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Term Life Insurance
                </Link>
              </li>
              <li>
                <Link href="/whole-life" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Whole Life Insurance
                </Link>
              </li>
              <li>
                <Link href="/universal-life" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Universal Life Insurance
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Compare Quotes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/licensing" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Licensing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} QuoteLinker. All rights reserved. QuoteLinker Insurance Services LLC
          </p>
          <p className="text-gray-400 text-xs text-center mt-2">
            Insurance products and services offered through QuoteLinker Insurance Services LLC. Licensed in all 50 states.
          </p>
        </div>
      </div>
    </footer>
  )
} 