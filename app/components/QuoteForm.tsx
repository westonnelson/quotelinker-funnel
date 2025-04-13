'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tooltip } from 'react-tooltip'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  gender: string
  healthStatus: string
  coverageAmount: string
  termLength: string
  tobaccoUse: string
  occupation: string
  annualIncome: string
}

export default function QuoteForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    healthStatus: '',
    coverageAmount: '',
    termLength: '',
    tobaccoUse: '',
    occupation: '',
    annualIncome: ''
  })

  const tooltips = {
    firstName: 'Required to personalize your quote',
    lastName: 'Required to personalize your quote',
    email: 'We'll send your quote details here',
    phone: 'Required to connect you with a licensed agent',
    age: 'Required to calculate accurate rates',
    gender: 'Required for accurate health assessment',
    healthStatus: 'Helps determine the best coverage options',
    coverageAmount: 'Recommended: 10-12x your annual income',
    termLength: 'How long you need coverage',
    tobaccoUse: 'Affects your rate calculation',
    occupation: 'Helps determine coverage needs',
    annualIncome: 'Helps recommend appropriate coverage'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName) {
          setError('Please enter your full name')
          return false
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          setError('Please enter a valid email address')
          return false
        }
        if (!formData.phone.match(/^\d{10}$/)) {
          setError('Please enter a valid 10-digit phone number')
          return false
        }
        break
      case 2:
        if (!formData.age || !formData.gender || !formData.healthStatus) {
          setError('Please complete all health information')
          return false
        }
        break
      case 3:
        if (!formData.coverageAmount || !formData.termLength) {
          setError('Please select your coverage preferences')
          return false
        }
        break
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
      setError('')
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Submission failed')
      
      // Track form submission
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submission', {
          event_category: 'quote_request',
          event_label: 'quote_form'
        })
      }

      router.push('/thank-you')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Form submission error:', err)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-1/3 h-2 rounded-full mx-1 ${
                step <= currentStep ? 'bg-[#00F2F2]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-2">
          {currentStep === 1 && 'Personal Information'}
          {currentStep === 2 && 'Health Information'}
          {currentStep === 3 && 'Coverage Preferences'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                    data-tooltip-id="firstName-tooltip"
                  />
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
                />
                <Tooltip id="firstName-tooltip" content={tooltips.firstName} />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                    data-tooltip-id="lastName-tooltip"
                  />
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
                />
                <Tooltip id="lastName-tooltip" content={tooltips.lastName} />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="email-tooltip"
                />
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
              />
              <Tooltip id="email-tooltip" content={tooltips.email} />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="phone-tooltip"
                />
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
              />
              <Tooltip id="phone-tooltip" content={tooltips.phone} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age *
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                    data-tooltip-id="age-tooltip"
                  />
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="35"
                  min="18"
                  max="85"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
                />
                <Tooltip id="age-tooltip" content={tooltips.age} />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                    data-tooltip-id="gender-tooltip"
                  />
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <Tooltip id="gender-tooltip" content={tooltips.gender} />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Health Status *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="health-tooltip"
                />
              </label>
              <select
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
              >
                <option value="">Select Health Status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
              <Tooltip id="health-tooltip" content={tooltips.healthStatus} />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tobacco Use *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="tobacco-tooltip"
                />
              </label>
              <select
                name="tobaccoUse"
                value={formData.tobaccoUse}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
              >
                <option value="">Select Tobacco Use</option>
                <option value="never">Never Used</option>
                <option value="former">Former User</option>
                <option value="current">Current User</option>
              </select>
              <Tooltip id="tobacco-tooltip" content={tooltips.tobaccoUse} />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coverage Amount *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="coverage-tooltip"
                />
              </label>
              <select
                name="coverageAmount"
                value={formData.coverageAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
              >
                <option value="">Select Coverage Amount</option>
                <option value="100000">$100,000</option>
                <option value="250000">$250,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000</option>
                <option value="2000000">$2,000,000+</option>
              </select>
              <Tooltip id="coverage-tooltip" content={tooltips.coverageAmount} />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term Length *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="term-tooltip"
                />
              </label>
              <select
                name="termLength"
                value={formData.termLength}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
              >
                <option value="">Select Term Length</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
                <option value="30">30 Years</option>
              </select>
              <Tooltip id="term-tooltip" content={tooltips.termLength} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                    data-tooltip-id="occupation-tooltip"
                  />
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Software Engineer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
                />
                <Tooltip id="occupation-tooltip" content={tooltips.occupation} />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Income
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                    data-tooltip-id="income-tooltip"
                  />
                </label>
                <input
                  type="text"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  placeholder="75,000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2]"
                />
                <Tooltip id="income-tooltip" content={tooltips.annualIncome} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-[#00F2F2] text-gray-900 rounded-lg hover:bg-[#00D6D6] transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto px-6 py-2 bg-[#00F2F2] text-gray-900 rounded-lg hover:bg-[#00D6D6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Get Your Quote'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 