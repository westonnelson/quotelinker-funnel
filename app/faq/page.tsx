export const metadata = {
  title: 'FAQ | Frequently Asked Questions | QuoteLinker',
  description: 'Find answers to frequently asked questions about life insurance, quotes, and the QuoteLinker process.',
}

export default function FAQ() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Find answers to common questions about life insurance and the QuoteLinker process.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Common Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We've compiled answers to the most frequently asked questions about our services.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <dt className="text-lg font-semibold text-gray-900">
                  How does QuoteLinker work?
                </dt>
                <dd className="mt-2 text-gray-600">
                  QuoteLinker simplifies the insurance process by connecting you with licensed agents who can provide personalized quotes based on your specific needs. Simply fill out our form, and we'll match you with the right coverage options.
                </dd>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <dt className="text-lg font-semibold text-gray-900">
                  What types of insurance do you offer?
                </dt>
                <dd className="mt-2 text-gray-600">
                  We offer a variety of insurance products including term life, whole life, short-term disability, and supplemental health insurance. Our platform helps you find the right coverage for your specific needs.
                </dd>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <dt className="text-lg font-semibold text-gray-900">
                  How quickly can I get coverage?
                </dt>
                <dd className="mt-2 text-gray-600">
                  The timeline varies depending on the type of insurance and your specific situation. Some policies can be approved in as little as 24 hours, while others may require a medical exam and take a few weeks to process.
                </dd>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <dt className="text-lg font-semibold text-gray-900">
                  Is my information secure?
                </dt>
                <dd className="mt-2 text-gray-600">
                  Yes, we take your privacy seriously. All information you provide is encrypted and securely stored. We never share your personal information with third parties without your consent.
                </dd>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <dt className="text-lg font-semibold text-gray-900">
                  Do I need to speak with an agent?
                </dt>
                <dd className="mt-2 text-gray-600">
                  While you can get quotes online, speaking with a licensed agent is recommended to ensure you understand your options and select the right coverage for your needs. Our agents are here to help guide you through the process.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 