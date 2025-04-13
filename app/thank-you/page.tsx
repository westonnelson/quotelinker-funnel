'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFB] to-white flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 neon-glow">
          <div className="flex justify-center mb-8">
            <div className="relative w-16 h-16 float-animation">
              <Image
                src="/q-logo.png"
                alt="QuoteLinker"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="w-16 h-16 bg-[#F8FAFB] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-[#00F2F2]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Thank You for Choosing <span className="text-[#00F2F2]">QuoteLinker</span>!
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            We've received your information and our AI is finding the best rates for you.
            A specialist will be in touch shortly with your personalized quote.
          </p>
          <div className="bg-[#F8FAFB] rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-[#00F2F2] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Review of your application
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-[#00F2F2] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Personalized quote preparation
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="w-5 h-5 text-[#00F2F2] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Specialist consultation call
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500 text-center">
            You will be redirected to the home page in a few seconds...
          </p>
        </div>
      </div>
    </main>
  )
}