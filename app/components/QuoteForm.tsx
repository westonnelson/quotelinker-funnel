'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import InputMask from 'react-input-mask-next'
import Link from 'next/link'

declare global {
  interface Window {
    analytics: {
      track: (event: string, properties: Record<string, any>) => void;
    };
    gtag: (
      command: "config" | "event" | "set", 
      action: string, 
      params?: { 
        [key: string]: any; 
        event_category?: string; 
        event_label?: string; 
        value?: number; 
      }
    ) => void;
  }
}

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
  annualIncome: string
  funnelType?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

interface QuoteFormProps {
  funnelType?: string
}

export default function QuoteForm({ funnelType = 'term_life' }: QuoteFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [legalConsent, setLegalConsent] = useState(false)
  
  // Get UTM parameters
  const utmSource = searchParams?.get('utm_source') || ''
  const utmMedium = searchParams?.get('utm_medium') || ''
  const utmCampaign = searchParams?.get('utm_campaign') || ''
  
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
    tobaccoUse: 'no',
    annualIncome: '',
    funnelType,
    utmSource,
    utmMedium,
    utmCampaign
  })

  const tooltips = {
    firstName: 'Required to personalize your quote',
    lastName: 'Required to personalize your quote',
    email: "We'll send your quote details here",
    phone: 'Required to connect you with a licensed agent',
    age: 'Required to calculate accurate rates',
    gender: 'Required for accurate health assessment',
    healthStatus: 'Helps determine the best coverage options',
    coverageAmount: 'Recommended: 10-12x your annual income',
    termLength: 'How long you need coverage',
    tobaccoUse: 'Affects your rate calculation',
    annualIncome: 'Helps recommend appropriate coverage'
  }

  const validateField = (field: string, value: any): string | undefined => {
    if (!value) {
      return 'This field is required'
    }

    switch (field) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
        break
      case 'phone':
        const phoneDigits = value.replace(/\D/g, '')
        if (phoneDigits.length < 10) {
          return 'Please enter a valid phone number'
        }
        break
      case 'age':
        const age = parseInt(value)
        if (isNaN(age) || age < 18 || age > 85) {
          return 'Age must be between 18 and 85'
        }
        break
      case 'coverageAmount':
        const amount = parseInt(value)
        if (isNaN(amount) || amount < 100000) {
          return 'Coverage amount must be at least $100,000'
        }
        break
    }
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Real-time validation
    const fieldError = validateField(name, value)
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldError || ''
    }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      phone: e.target.value
    }))

    // Real-time validation
    const fieldError = validateField('phone', e.target.value)
    setValidationErrors(prev => ({
      ...prev,
      phone: fieldError || ''
    }))
  }

  const handleAnnualIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, '')
    setFormData(prev => ({
      ...prev,
      annualIncome: value
    }))

    // Real-time validation
    const fieldError = validateField('annualIncome', value)
    setValidationErrors(prev => ({
      ...prev,
      annualIncome: fieldError || ''
    }))
  }

  const validateStep = (stepFields: string[]): Record<string, string> => {
    const errors: Record<string, string> = {}
    stepFields.forEach(field => {
      const value = formData[field as keyof FormData]
      const error = validateField(field, value)
      if (error) errors[field] = error
    })
    return errors
  }

  const handleNext = () => {
    const errors = validateStep(currentStep === 1 ? ['firstName', 'lastName', 'email', 'phone'] : ['age', 'gender', 'healthStatus', 'tobaccoUse'])
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => prev + 1)
      setError('')
    } else {
      setValidationErrors(errors)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateStep(currentStep === 1 ? ['firstName', 'lastName', 'email', 'phone'] : ['age', 'gender', 'healthStatus', 'tobaccoUse'])
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    if (!legalConsent) {
      setError('You must agree to the Privacy Policy and Terms of Service to continue.')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    try {
      console.log('Submitting form data:', formData)
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed')
      }
      
      // Track form submission with GA4
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'quote_submitted', {
          event_category: 'quote_request',
          event_label: formData.funnelType || 'quote_form',
          value: parseInt(formData.coverageAmount, 10)
        })
      }

      // Track HubSpot event if available
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('Quote Request Submitted', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          coverageAmount: formData.coverageAmount,
          termLength: formData.termLength,
          funnelType: formData.funnelType
        })
      }

      // Redirect to thank you page
      router.push('/thank-you')
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '')
    if (digitsOnly.length === 0) return ''
    
    if (digitsOnly.length <= 3) {
      return `(${digitsOnly}`
    } else if (digitsOnly.length <= 6) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
    } else {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-1/3 h-2 rounded-full mx-1 transition-colors duration-300 ${
                step <= currentStep ? 'bg-[#00F2F2]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2">
          {currentStep === 1 && 'Personal Information'}
          {currentStep === 2 && 'Health Information'}
          {currentStep === 3 && 'Coverage Preferences'}
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Step {currentStep} of 3
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                    validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.firstName}</p>
                )}
                <ReactTooltip id="firstName-tooltip" content={tooltips.firstName} />
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
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                    validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.lastName}</p>
                )}
                <ReactTooltip id="lastName-tooltip" content={tooltips.lastName} />
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
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
              <ReactTooltip id="email-tooltip" content={tooltips.email} />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="phone-tooltip"
                />
              </label>
              <InputMask
                mask="(999) 999-9999"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="(555) 555-5555"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.phone}</p>
              )}
              <ReactTooltip id="phone-tooltip" content={tooltips.phone} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onChange={handleChange}
                  placeholder="35"
                  min="18"
                  max="85"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                    validationErrors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.age && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.age}</p>
                )}
                <ReactTooltip id="age-tooltip" content={tooltips.age} />
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
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                    validationErrors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.gender && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.gender}</p>
                )}
                <ReactTooltip id="gender-tooltip" content={tooltips.gender} />
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
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                  validationErrors.healthStatus ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Health Status</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
              {validationErrors.healthStatus && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.healthStatus}</p>
              )}
              <ReactTooltip id="health-tooltip" content={tooltips.healthStatus} />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tobacco Use *
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="tobacco-tooltip"
                />
              </label>
              <div className="flex space-x-4 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tobaccoUse"
                    value="no"
                    checked={formData.tobaccoUse === 'no'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-[#00F2F2] focus:ring-[#00F2F2]"
                  />
                  <span className="ml-2 text-gray-700">No</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tobaccoUse"
                    value="yes"
                    checked={formData.tobaccoUse === 'yes'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-[#00F2F2] focus:ring-[#00F2F2]"
                  />
                  <span className="ml-2 text-gray-700">Yes</span>
                </label>
              </div>
              {validationErrors.tobaccoUse && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.tobaccoUse}</p>
              )}
              <ReactTooltip id="tobacco-tooltip" content={tooltips.tobaccoUse} />
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
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                  validationErrors.coverageAmount ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Coverage Amount</option>
                <option value="100000">$100,000</option>
                <option value="250000">$250,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000</option>
                <option value="2000000">$2,000,000+</option>
              </select>
              {validationErrors.coverageAmount && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.coverageAmount}</p>
              )}
              <ReactTooltip id="coverage-tooltip" content={tooltips.coverageAmount} />
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
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                  validationErrors.termLength ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Term Length</option>
                <option value="10">10 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
              {validationErrors.termLength && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.termLength}</p>
              )}
              <ReactTooltip id="term-tooltip" content={tooltips.termLength} />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Income
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400 cursor-help"
                  data-tooltip-id="income-tooltip"
                />
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleAnnualIncomeChange}
                    placeholder="75,000"
                    className={`w-full pl-7 pr-4 py-2 border rounded-lg focus:ring-[#00F2F2] focus:border-[#00F2F2] ${
                      validationErrors.annualIncome ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <QuestionMarkCircleIcon
                    className="h-5 w-5 ml-2 text-gray-400 cursor-help"
                    data-tooltip-id="income-tooltip"
                  />
                </div>
              </div>
              {validationErrors.annualIncome && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.annualIncome}</p>
              )}
              <ReactTooltip id="income-tooltip" content={tooltips.annualIncome} />
            </div>
            <div className="relative mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="legal-consent"
                    name="legal-consent"
                    type="checkbox"
                    checked={legalConsent}
                    onChange={(e) => setLegalConsent(e.target.checked)}
                    className="h-4 w-4 text-[#00F2F2] focus:ring-[#00F2F2] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="legal-consent" className="font-medium text-gray-700">
                    I agree to be contacted via phone, text, or email. I have read and agree to the{' '}
                    <Link href="/privacy-policy" className="text-[#00F2F2] hover:text-[#00D6D6]">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms-of-service" className="text-[#00F2F2] hover:text-[#00D6D6]">
                      Terms of Service
                    </Link>.
                  </label>
                </div>
              </div>
              {!legalConsent && error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-[#00F2F2] text-gray-900 rounded-lg hover:bg-[#00D6D6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || Object.keys(validationErrors).length > 0}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(validationErrors).length > 0}
              className="ml-auto px-6 py-3 bg-[#00F2F2] text-gray-900 rounded-lg hover:bg-[#00D6D6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Get Your Quote'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 