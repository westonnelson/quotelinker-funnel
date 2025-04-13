import QuoteForm from '../components/QuoteForm'

export const metadata = {
  title: 'Get Your Term Life Insurance Quote | QuoteLinker',
  description: 'Get an instant term life insurance quote. Compare rates and find the perfect coverage for your needs.',
}

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Get Your Term Life Insurance Quote
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to receive your personalized quote. Our licensed agents will help you find the best coverage for your needs.
          </p>
        </div>
        
        <QuoteForm />
      </div>
    </main>
  )
} 