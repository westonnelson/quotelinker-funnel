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
  insuranceType: string;
  coverageAmount: string;
  termLength: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  tobaccoUse: string;
  funnelType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface QuoteFormProps {
  funnelType?: string
}

export default function QuoteForm({ funnelType = 'term_life' }: QuoteFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [legalConsent, setLegalConsent] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  // Get UTM parameters
  const utmSource = searchParams?.get('utm_source') || ''
  const utmMedium = searchParams?.get('utm_medium') || ''
  const utmCampaign = searchParams?.get('utm_campaign') || ''
  
  const [formData, setFormData] = useState<FormData>({
    insuranceType: '',
    coverageAmount: '',
    termLength: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    tobaccoUse: 'no',
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

  const validateField = (field: keyof FormData, value: string | undefined): string => {
    if (!value) {
      return 'This field is required';
    }

    switch (field) {
      case 'firstName':
        return !value ? 'First name is required' : '';
      case 'lastName':
        return !value ? 'Last name is required' : '';
      case 'email':
        return !value ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : '';
      case 'phone':
        return !value ? 'Phone number is required' : value.replace(/\D/g, '').length !== 10 ? 'Invalid phone number' : '';
      case 'dateOfBirth':
        return !value ? 'Date of birth is required' : '';
      case 'gender':
        return !value ? 'Gender is required' : '';
      case 'height':
        return !value ? 'Height is required' : '';
      case 'weight':
        return !value ? 'Weight is required' : '';
      case 'tobaccoUse':
        return !value ? 'Tobacco use status is required' : '';
      case 'insuranceType':
        return !value ? 'Insurance type is required' : '';
      case 'coverageAmount':
        return !value ? 'Coverage amount is required' : '';
      case 'termLength':
        return !value ? 'Term length is required' : '';
      default:
        return '';
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    const fieldError = validateField(field, value)
    setValidationErrors(prev => ({
      ...prev,
      [field]: fieldError || ''
    }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange('phone', value);
  };

  const handleNext = () => {
    const stepFields: (keyof FormData)[] = currentStep === 0 
      ? ['insuranceType', 'coverageAmount', 'termLength']
      : currentStep === 1
      ? ['firstName', 'lastName', 'email', 'phone']
      : ['dateOfBirth', 'gender', 'height', 'weight', 'tobaccoUse'];
    
    const errors: Partial<Record<keyof FormData, string>> = {};
    stepFields.forEach(field => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => prev + 1);
      setValidationErrors({});
    } else {
      setValidationErrors(errors);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          funnelType: formData.funnelType || undefined,
          utmSource: formData.utmSource || undefined,
          utmMedium: formData.utmMedium || undefined,
          utmCampaign: formData.utmCampaign || undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setShowSuccess(true);
      // Track form submission in Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_submission', {
          event_category: 'Quote Form',
          event_label: formData.insuranceType,
          value: parseInt(formData.coverageAmount)
        });
      }
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const validateStep = (step: number): Partial<Record<keyof FormData, string>> => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    
    if (step === 0) {
      const stepFields: (keyof FormData)[] = ['insuranceType', 'coverageAmount', 'termLength'];
      stepFields.forEach(field => {
        const value = formData[field];
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      });
    } else if (step === 1) {
      const stepFields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'phone'];
      stepFields.forEach(field => {
        const value = formData[field];
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      });
    } else if (step === 2) {
      const stepFields: (keyof FormData)[] = ['dateOfBirth', 'gender', 'height', 'weight', 'tobaccoUse'];
      stepFields.forEach(field => {
        const value = formData[field];
        const error = validateField(field, value);
        if (error) {
          errors[field] = error;
        }
      });
    }
    
    return errors;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Trust Signals */}
      <div className="mb-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900">Licensed & Secure</p>
          <p className="text-xs text-gray-600">HIPAA Compliant</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900">2-Minute Quote</p>
          <p className="text-xs text-gray-600">Fast & Easy Process</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900">Instant Results</p>
          <p className="text-xs text-gray-600">Compare Top Carriers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep + 1 >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`h-1 w-24 sm:w-32 ${
                    currentStep + 1 > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Coverage Details</span>
            <span>Personal Info</span>
            <span>Health Profile</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {currentStep === 0 ? 'Find Your Best Rate' :
             currentStep === 1 ? 'Tell Us About Yourself' :
             'Almost Done!'}
          </h2>
          <p className="text-lg text-gray-600">
            {currentStep === 0 ? 'Compare rates from top-rated insurance providers' :
             currentStep === 1 ? 'Help us personalize your quote' :
             'Just a few more details to get your quote'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance Type
                </label>
                <select
                  value={formData.insuranceType}
                  onChange={(e) => handleInputChange('insuranceType', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select insurance type</option>
                  <option value="term">Term Life Insurance</option>
                  <option value="whole">Whole Life Insurance</option>
                  <option value="universal">Universal Life Insurance</option>
                </select>
                {validationErrors.insuranceType && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.insuranceType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coverage Amount
                </label>
                <select
                  value={formData.coverageAmount}
                  onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select coverage amount</option>
                  <option value="100000">$100,000</option>
                  <option value="250000">$250,000</option>
                  <option value="500000">$500,000</option>
                  <option value="1000000">$1,000,000</option>
                </select>
                {validationErrors.coverageAmount && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.coverageAmount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term Length
                </label>
                <select
                  value={formData.termLength}
                  onChange={(e) => handleInputChange('termLength', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select term length</option>
                  <option value="10">10 Years</option>
                  <option value="20">20 Years</option>
                  <option value="30">30 Years</option>
                </select>
                {validationErrors.termLength && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.termLength}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your first name"
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your last name"
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <InputMask
                  mask="(999) 999-9999"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="(555) 555-5555"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {validationErrors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {validationErrors.gender && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (inches)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter height in inches"
                />
                {validationErrors.height && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.height}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter weight in pounds"
                />
                {validationErrors.weight && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.weight}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tobacco Use
                </label>
                <select
                  value={formData.tobaccoUse}
                  onChange={(e) => handleInputChange('tobaccoUse', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select tobacco use status</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
                {validationErrors.tobaccoUse && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.tobaccoUse}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back
              </button>
            )}
            {currentStep < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Get Your Quote'}
              </button>
            )}
          </div>
        </form>

        {/* Social Proof */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">1,000+</span> customers helped this month
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-600">
                <span className="font-semibold">4.9/5</span> average rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-700">
            Your information has been submitted successfully. A licensed insurance agent will contact you shortly to discuss your personalized quote.
          </p>
        </div>
      )}
    </div>
  )
} 