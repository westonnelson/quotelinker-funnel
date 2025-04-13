'use client'

import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export const metadata = {
  title: 'Thank You | QuoteLinker',
  description: 'Thank you for your quote request. We will be in touch shortly.',
}

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Thank You!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your quote request has been submitted successfully. We will review your information and contact you shortly with personalized options.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#00F2F2] hover:bg-[#00D6D6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00F2F2]"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}