'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function ThankYou() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Thank You!
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            We've received your quote request and a licensed agent will contact you shortly to discuss your options.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            In the meantime, you can learn more about our insurance products or contact us with any questions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/term-life"
              className="rounded-lg bg-[#00F2F2] px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-[#00D6D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F2F2]"
            >
              Learn More
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-900 hover:text-[#00F2F2]"
            >
              Contact Us <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}