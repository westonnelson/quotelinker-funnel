export const metadata = {
  title: 'Privacy Policy | QuoteLinker',
  description: 'Learn about how QuoteLinker collects, uses, and protects your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Privacy Policy
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
            <h2>Introduction</h2>
            <p>
              At QuoteLinker, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including but not limited to:
            </p>
            <ul>
              <li>Personal identification information (name, email address, phone number, etc.)</li>
              <li>Health information (age, gender, health status, tobacco use)</li>
              <li>Financial information (annual income, coverage preferences)</li>
              <li>Any other information you choose to provide</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Connect you with licensed insurance agents</li>
              <li>Send you quotes and information about insurance products</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
            
            <h2>Information Sharing</h2>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Licensed insurance agents who can provide you with quotes</li>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement or other third parties as required by law</li>
            </ul>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: privacy@quotelinker.com<br />
              Address: 123 Insurance Way, Suite 100, Anytown, USA 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 