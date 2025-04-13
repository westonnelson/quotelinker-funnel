import { redirect } from 'next/navigation'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Insurance Made Simple
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Get instant quotes from top providers. Compare rates and find the perfect coverage for your needs.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/term-life"
            className="rounded-lg bg-[#00F2F2] px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-[#00D6D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F2F2]"
          >
            Get Your Quote
          </a>
          <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  )
} 