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
    coverageAmount: 'Recommended: 10-12x your annual income',
    termLength: 'How long you need coverage',
    tobaccoUse: 'Affects your rate calculation'
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
      : ['dateOfBirth', 'gender', 'tobaccoUse'];
    
    const errors: Partial<Record<keyof FormData, string>> = {};
    stepFields.forEach(field => {
      const value = formData[field];
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    if (Object.keys(errors).length === 0) {
      if (currentStep === 2) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
        setValidationErrors({});
      }
    } else {
      setValidationErrors(errors);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
    setError('')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          insuranceType: formData.insuranceType,
          coverageAmount: formData.coverageAmount,
          termLength: formData.termLength,
          tobaccoUse: formData.tobaccoUse,
          source: formData.funnelType || 'term_life_quote_form',
          utmSource: formData.utmSource,
          utmMedium: formData.utmMedium,
          utmCampaign: formData.utmCampaign
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      // Track form submission in Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submission', {
          event_category: 'Quote Form',
          event_label: formData.insuranceType,
          value: parseInt(formData.coverageAmount)
        });
      }

      // Redirect to thank you page
      router.push('/thank-you');
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {['Coverage Details', 'Personal Info', 'Health Profile'].map((step, index) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${index <= currentStep ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-gray-300 text-gray-500'}`}
              >
                {index + 1}
              </div>
              <span className={`mt-2 text-sm font-medium ${index <= currentStep ? 'text-cyan-500' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          ))}
          {/* Progress Bar */}
          <div className="absolute top-5 left-0 h-0.5 bg-gray-200 w-full -z-10">
            <div 
              className="h-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentStep === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Type
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="insurance-type-tooltip"
                />
              </label>
              <select
                value={formData.insuranceType}
                onChange={(e) => handleInputChange('insuranceType', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="">Select Insurance Type</option>
                <option value="term">Term Life Insurance</option>
                <option value="whole">Whole Life Insurance</option>
                <option value="universal">Universal Life Insurance</option>
              </select>
              {validationErrors.insuranceType && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.insuranceType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coverage Amount
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="coverage-amount-tooltip"
                />
              </label>
              <select
                value={formData.coverageAmount}
                onChange={(e) => handleInputChange('coverageAmount', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
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
                <p className="mt-1 text-sm text-red-600">{validationErrors.coverageAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term Length
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="term-length-tooltip"
                />
              </label>
              <select
                value={formData.termLength}
                onChange={(e) => handleInputChange('termLength', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="">Select Term Length</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
                <option value="30">30 Years</option>
              </select>
              {validationErrors.termLength && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.termLength}</p>
              )}
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400" 
                    data-tooltip-id="first-name-tooltip"
                  />
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="John"
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                  <QuestionMarkCircleIcon 
                    className="inline-block w-4 h-4 ml-1 text-gray-400" 
                    data-tooltip-id="last-name-tooltip"
                  />
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                  placeholder="Doe"
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="email-tooltip"
                />
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="john@example.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="phone-tooltip"
                />
              </label>
              <InputMask
                mask="(999) 999-9999"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="(555) 555-5555"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
              )}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="dob-tooltip"
                />
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              />
              {validationErrors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="gender-tooltip"
                />
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {validationErrors.gender && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tobacco Use
                <QuestionMarkCircleIcon 
                  className="inline-block w-4 h-4 ml-1 text-gray-400" 
                  data-tooltip-id="tobacco-tooltip"
                />
              </label>
              <select
                value={formData.tobaccoUse}
                onChange={(e) => handleInputChange('tobaccoUse', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              {validationErrors.tobaccoUse && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.tobaccoUse}</p>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className={`${currentStep === 0 ? 'ml-auto' : ''} px-6 py-2 text-sm font-medium text-white bg-cyan-500 border border-transparent rounded-md shadow-sm hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : currentStep === 2 ? 'Get My Quote' : 'Next'}
          </button>
        </div>
      </div>

      {/* Tooltips */}
      {Object.entries(tooltips).map(([id, content]) => (
        <ReactTooltip
          key={id}
          id={`${id}-tooltip`}
          place="top"
          content={content}
        />
      ))}
    </div>
  );
} 