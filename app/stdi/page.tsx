import QuoteForm from '../components/QuoteForm'

export const metadata = {
  title: 'Short-Term Disability Insurance Quotes | QuoteLinker',
  description: 'Get instant short-term disability insurance quotes. Compare rates from top providers and find the best coverage for your needs.',
}

export default function ShortTermDisability() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Short-Term Disability Insurance
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Protect your income if you're unable to work due to illness or injury. Get instant quotes and connect with licensed agents who can help you find the right coverage.
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
          <QuoteForm funnelType="stdi" />
        </div>
      </div>

      <div className="bg-white py-12 sm:py-16" id="learn-more">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Short-Term Disability Insurance?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Short-term disability insurance provides income protection when you're unable to work due to illness, injury, or pregnancy, helping you maintain financial stability during recovery.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Income Protection
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Receive a portion of your regular income when you're unable to work, helping you cover essential expenses like rent, utilities, and groceries during recovery.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Quick Coverage
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Benefits typically begin within 1-14 days after a qualifying disability, providing faster financial support compared to long-term disability insurance.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Flexible Coverage Periods
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Coverage typically lasts 3-6 months, bridging the gap between your sick leave and long-term disability benefits, if applicable.
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