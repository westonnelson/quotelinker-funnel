export const metadata = {
  title: 'Terms of Service | QuoteLinker',
  description: 'Read the terms and conditions for using QuoteLinker\'s insurance quote services.',
}

export default function TermsOfService() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Terms of Service
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="prose prose-lg prose-indigo mx-auto">
            <h2>Agreement to Terms</h2>
            <p>
              By accessing or using QuoteLinker's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
            
            <h2>Description of Service</h2>
            <p>
              QuoteLinker provides an online platform that connects users with licensed insurance agents who can provide quotes for various insurance products. We do not sell insurance directly but facilitate the connection between users and insurance providers.
            </p>
            
            <h2>User Responsibilities</h2>
            <p>
              As a user of our service, you agree to:
            </p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to circumvent any security features</li>
              <li>Not use the service to harass, abuse, or harm others</li>
              <li>Not use automated methods to access the service</li>
            </ul>
            
            <h2>Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by QuoteLinker and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            
            <h2>Disclaimer</h2>
            <p>
              QuoteLinker is not an insurance company and does not provide insurance directly. We are a lead generation service that connects users with licensed insurance agents. We make no representations or warranties about the accuracy, reliability, or availability of the service.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              In no event shall QuoteLinker be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
            
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p>
              Email: legal@quotelinker.com<br />
              Address: 123 Insurance Way, Suite 100, Anytown, USA 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 