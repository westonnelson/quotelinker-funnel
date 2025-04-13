'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LinkIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/solid'

declare global {
  interface Window {
    _hsq: any[]
    dataLayer: any[]
  }
}

export default function TermLifePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    coverage_amount: '250000',
    term_length: '20',
    health_status: 'good'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Submit to Supabase
      const { error: supabaseError } = await supabase
        .from('leads')
        .insert([{
          ...formData,
          age: parseInt(formData.age),
          coverage_amount: parseInt(formData.coverage_amount),
          term_length: parseInt(formData.term_length)
        }])

      if (supabaseError) throw supabaseError

      // Track form submission in HubSpot
      if (typeof window !== 'undefined' && window._hsq) {
        window._hsq.push(['identify', {
          email: formData.email,
          firstname: formData.first_name,
          lastname: formData.last_name,
          phone: formData.phone,
          age: formData.age,
          gender: formData.gender,
          coverage_amount: formData.coverage_amount,
          term_length: formData.term_length,
          health_status: formData.health_status
        }])
        
        window._hsq.push(['trackEvent', {
          id: 'term_life_quote_submission',
          value: parseInt(formData.coverage_amount)
        }])
      }

      // Track conversion in Google Analytics
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          'event': 'form_submission',
          'form_name': 'term_life_quote',
          'conversion_value': parseInt(formData.coverage_amount)
        })
      }

      router.push('/thank-you')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8FAFB] to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <LinkIcon className="h-16 w-16 text-[#00F2F2] animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Your <span className="text-[#00F2F2]">Term Life Insurance</span> Quote Today
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fast, Simple, and Secure. Get the coverage you need in minutes.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 neon-glow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center p-4 rounded-lg bg-[#F8FAFB]">
              <LinkIcon className="h-8 w-8 mx-auto mb-2 text-[#00F2F2]" />
              <div className="text-[#00F2F2] text-2xl font-bold mb-2">1M+</div>
              <div className="text-gray-600">Quotes Generated</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#F8FAFB]">
              <ShieldCheckIcon className="h-8 w-8 mx-auto mb-2 text-[#00F2F2]" />
              <div className="text-[#00F2F2] text-2xl font-bold mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#F8FAFB]">
              <StarIcon className="h-8 w-8 mx-auto mb-2 text-[#00F2F2]" />
              <div className="text-[#00F2F2] text-2xl font-bold mb-2">5★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  max="85"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.health_status}
                  onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coverage Amount
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.coverage_amount}
                  onChange={(e) => setFormData({ ...formData, coverage_amount: e.target.value })}
                >
                  <option value="100000">$100,000</option>
                  <option value="250000">$250,000</option>
                  <option value="500000">$500,000</option>
                  <option value="1000000">$1,000,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term Length
                </label>
                <select
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2F2] focus:border-[#00F2F2] hover-neon"
                  value={formData.term_length}
                  onChange={(e) => setFormData({ ...formData, term_length: e.target.value })}
                >
                  <option value="10">10 Years</option>
                  <option value="20">20 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00F2F2] text-gray-900 py-4 px-6 rounded-lg font-medium hover:bg-[#00D6D6] focus:outline-none focus:ring-2 focus:ring-[#00F2F2] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover-neon"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Get Your Personalized Quote Now'
              )}
            </button>

            <p className="text-sm text-gray-500 text-center mt-4">
              By submitting this form, you agree to our{' '}
              <a href="#" className="text-[#00F2F2] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#00F2F2] hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}