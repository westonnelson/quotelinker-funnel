import QuoteForm from '../components/QuoteForm'

export const metadata = {
  title: 'Supplemental Health Insurance Quotes | QuoteLinker',
  description: 'Get instant supplemental health insurance quotes. Compare rates from top providers and find the best coverage for your needs.',
}

export default function SupplementalHealth() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Supplemental Health Insurance
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Fill the gaps in your primary health coverage with supplemental insurance. Get instant quotes and connect with licensed agents who can help you find the right coverage.
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
          <QuoteForm funnelType="supplemental_health" />
        </div>
      </div>

      <div className="bg-white py-12 sm:py-16" id="learn-more">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Supplemental Health Insurance?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Supplemental health insurance helps cover out-of-pocket costs not covered by your primary health insurance, providing additional financial protection for medical expenses.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Cover Out-of-Pocket Costs
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Help pay for deductibles, copayments, and coinsurance that your primary health insurance doesn't cover, reducing your overall healthcare expenses.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Cash Benefits
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Receive cash benefits directly to you when you're hospitalized or receive specific medical treatments, giving you flexibility in how you use the money.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Works with Any Health Plan
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Supplemental health insurance can be purchased alongside any primary health insurance plan, including Medicare, employer-sponsored plans, or marketplace plans.
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