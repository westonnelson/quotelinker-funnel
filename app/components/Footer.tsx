'use client'

import Link from 'next/link'
import { LinkIcon } from '@heroicons/react/24/solid'
import { 
  FaceSmileIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <LinkIcon className="h-8 w-8 text-[#00F2F2] mr-2" />
              <span className="text-xl font-semibold text-gray-900">QuoteLinker</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Making insurance simple, affordable, and accessible for everyone.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00F2F2]">
                <span className="sr-only">Facebook</span>
                <FaceSmileIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00F2F2]">
                <span className="sr-only">Twitter</span>
                <ChatBubbleLeftIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00F2F2]">
                <span className="sr-only">LinkedIn</span>
                <UserGroupIcon className="h-6 w-6" />
              </a>
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
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Whole Life Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Universal Life Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
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
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Press
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
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
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#00F2F2] text-sm">
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