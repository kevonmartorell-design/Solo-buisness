import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const serviceCountOptions = [
    '1-5',
    '6-10',
    '11-20',
    '21-50',
    '50+',
];

const certRequirements = [
    'Yes, heavily regulated/certified (e.g., security licenses, cosmetology)',
    'Yes, some specialized skills required',
    'No, general training is sufficient',
    'Not applicable',
];

const trackingOptions = [
    { key: 'time' as const, label: 'Service completion time' },
    { key: 'quality' as const, label: 'Service quality/ratings' },
    { key: 'assignments' as const, label: 'Employee assigned to each service' },
    { key: 'inventory' as const, label: 'Service inventory/supplies' },
    { key: 'sops' as const, label: 'Standard Operating Procedures (SOPs)' },
];

const productOptions = [
    'Yes, it\'s a major part of revenue',
    'Yes, but it\'s supplementary',
    'No, services only',
    'No, products only',
    'Not applicable',
];

const Step5ServicesOfferings = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleTrackingToggle = (key: keyof typeof data.serviceTracking, value: boolean) => {
        updateData({
            serviceTracking: {
                ...data.serviceTracking,
                [key]: value
            }
        });
    };

    const isFormValid = () => {
        return data.serviceCount && data.certificationRequired;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Services & Offerings</h2>
                <p className="mt-1 text-sm text-gray-500">
                    What are you selling?
                </p>
            </div>

            <div className="space-y-6">
                {/* 5.1 Service Catalog */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How many different services/products do you offer?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {serviceCountOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`count-${option}`}
                                    name="serviceCount"
                                    type="radio"
                                    checked={data.serviceCount === option}
                                    onChange={() => updateData({ serviceCount: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`count-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do your services require specific employee certifications or skills?</label>
                    <div className="space-y-2">
                        {certRequirements.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`cert-${option}`}
                                    name="certificationRequired"
                                    type="radio"
                                    checked={data.certificationRequired === option}
                                    onChange={() => updateData({ certificationRequired: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`cert-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you need to track:</label>
                    <div className="space-y-2">
                        {trackingOptions.map((opt) => (
                            <div key={opt.key} className="flex items-center">
                                <input
                                    id={`track-${opt.key}`}
                                    type="checkbox"
                                    checked={data.serviceTracking[opt.key]}
                                    onChange={(e) => handleTrackingToggle(opt.key, e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`track-${opt.key}`} className="ml-2 block text-sm text-gray-900">
                                    {opt.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you sell products in addition to services?</label>
                    <div className="space-y-2">
                        {productOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`prod-${option}`}
                                    name="productSales"
                                    type="radio"
                                    checked={data.productSales === option}
                                    onChange={() => updateData({ productSales: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`prod-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="flex justify-between pt-5">
                <button
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={!isFormValid()}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default Step5ServicesOfferings;
