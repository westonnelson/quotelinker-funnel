export const metadata = {
  title: 'About QuoteLinker | Our Mission and Values',
  description: 'Learn about QuoteLinker\'s mission to make insurance simple, affordable, and accessible for everyone.',
}

export default function About() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              About QuoteLinker
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're on a mission to make insurance simple, affordable, and accessible for everyone.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Story
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              QuoteLinker was founded with a simple idea: insurance shouldn't be complicated. We believe everyone deserves access to quality insurance coverage without the hassle of traditional methods.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Our Mission
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    To simplify the insurance process and connect people with the right coverage at the right price.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Our Values
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Transparency, simplicity, and customer-first approach guide everything we do.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  Our Impact
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    We've helped over 1,000+ customers find the right insurance coverage for their needs.
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