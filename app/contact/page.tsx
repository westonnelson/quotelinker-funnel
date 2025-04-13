export const metadata = {
  title: 'Contact QuoteLinker | Get in Touch',
  description: 'Contact QuoteLinker for questions about insurance quotes, coverage options, or general inquiries.',
}

export default function Contact() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Have questions? We're here to help. Reach out to our team for assistance with your insurance needs.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our team is available to answer your questions and provide guidance on your insurance options.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Email Us</h3>
                <p className="text-gray-600 mb-4">
                  For general inquiries or support, email us at:
                </p>
                <a href="mailto:support@quotelinker.com" className="text-[#00F2F2] hover:text-[#00D6D6] font-medium">
                  support@quotelinker.com
                </a>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Call Us</h3>
                <p className="text-gray-600 mb-4">
                  Speak with a licensed insurance agent:
                </p>
                <a href="tel:1-800-555-1234" className="text-[#00F2F2] hover:text-[#00D6D6] font-medium">
                  1-800-555-1234
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Monday-Friday, 9am-5pm EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 