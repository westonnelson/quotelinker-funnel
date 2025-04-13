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
    if (!value || value.trim() === '') {
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

  const handleNext = () => {
    const stepFields = currentStep === 1 
      ? ['firstName', 'lastName', 'email', 'phone']
      : currentStep === 2
      ? ['age', 'gender', 'healthStatus', 'tobaccoUse']
      : ['coverageAmount', 'termLength']
    
    const errors: Record<string, string> = {}
    stepFields.forEach(field => {
      const value = formData[field as keyof FormData]
      const error = validateField(field, value)
      if (error) {
        errors[field] = error
      }
    })

    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => prev + 1)
      setValidationErrors({})
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
    const errors = validateField(currentStep === 1 ? 'firstName' : 'age', formData[currentStep === 1 ? 'firstName' : 'age'])
    if (errors) {
      setValidationErrors({ [currentStep === 1 ? 'firstName' : 'age']: errors })
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`h-1 w-24 sm:w-32 md:w-48 ${
                    currentStep > step ? 'bg-cyan-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Health Details"}
              {currentStep === 3 && "Coverage Preferences"}
            </h2>
            <p className="mt-2 text-gray-600">Step {currentStep} of 3</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                      <ReactTooltip id="firstName" className="max-w-xs" />
                      <QuestionMarkCircleIcon
                        data-tooltip-id="firstName"
                        data-tooltip-content={tooltips.firstName}
                        className="inline-block w-4 h-4 ml-1 text-gray-400"
                      />
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    {validationErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                      <ReactTooltip id="lastName" className="max-w-xs" />
                      <QuestionMarkCircleIcon
                        data-tooltip-id="lastName"
                        data-tooltip-content={tooltips.lastName}
                        className="inline-block w-4 h-4 ml-1 text-gray-400"
                      />
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    {validationErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                    <ReactTooltip id="email" className="max-w-xs" />
                    <QuestionMarkCircleIcon
                      data-tooltip-id="email"
                      data-tooltip-content={tooltips.email}
                      className="inline-block w-4 h-4 ml-1 text-gray-400"
                    />
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                    <ReactTooltip id="phone" className="max-w-xs" />
                    <QuestionMarkCircleIcon
                      data-tooltip-id="phone"
                      data-tooltip-content={tooltips.phone}
                      className="inline-block w-4 h-4 ml-1 text-gray-400"
                    />
                  </label>
                  <InputMask
                    mask="(999) 999-9999"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                    placeholder="(555) 555-5555"
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-cyan-500 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                  currentStep === 1 ? 'ml-auto' : ''
                }`}
              >
                {currentStep === 3 ? 'Get Your Quote' : 'Next'}
              </button>
            </div>
          </form>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center space-x-3">
            <svg className="h-6 w-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm text-gray-600">Your information is secure</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="h-6 w-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">2-minute quote process</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="h-6 w-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            <span className="text-sm text-gray-600">Licensed agent support</span>
          </div>
        </div>
      </div>
    </div>
  )
} 