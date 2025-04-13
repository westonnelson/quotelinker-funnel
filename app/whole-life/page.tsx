import QuoteForm from '../components/QuoteForm'

export const metadata = {
  title: 'Whole Life Insurance Quotes | QuoteLinker',
  description: 'Get instant whole life insurance quotes. Compare rates from top providers and secure lifelong coverage with cash value benefits.',
}

export default function WholePage() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Whole Life Insurance
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Secure lifelong coverage and build cash value with whole life insurance. Get instant quotes and connect with licensed agents who can help you find the right policy.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#quote-form"
                className="rounded-lg bg-[#00F2F2] px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-[#00D6D6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00F2F2]"
              >
                Get Your Quote
              </a>
              <a href="#learn-more" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 sm:py-16" id="quote-form">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <QuoteForm />
        </div>
      </div>

      <div className="bg-white py-12 sm:py-16" id="learn-more">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Whole Life Insurance?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whole life insurance provides permanent coverage and builds cash value over time, offering both protection and investment benefits.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Lifelong Coverage
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Your policy remains in force for your entire life, ensuring your loved ones are always protected, regardless of when the need arises.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Cash Value Growth
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Build tax-deferred cash value over time that you can borrow against or use for future needs, providing both insurance and investment benefits.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Fixed Premiums
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Lock in level premiums that never increase, providing predictable costs and making it easier to budget for the long term.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 