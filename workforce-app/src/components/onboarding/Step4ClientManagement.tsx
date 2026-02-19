import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const clientCountOptions = [
    'Less than 50',
    '50-100',
    '100-500',
    '500-1,000',
    '1,000-5,000',
    '5,000+',
];

const crmOptions = [
    'Pen and paper/physical files',
    'Excel/Google Sheets',
    'Another CRM system',
    'No formal system',
    'Point of Sale (POS) system',
    'Other',
];

const dataPoints = [
    'Contact information',
    'Service history',
    'Purchase history',
    'Preferences/Notes',
    'Appointment history',
    'Payment information',
    'Feedback/Ratings',
    'Referral source',
    'Lifetime value',
    'Other',
];

const Step4ClientManagement = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleDataToggle = (point: string) => {
        const current = data.importantData || [];
        if (current.includes(point)) {
            updateData({ importantData: current.filter(p => p !== point) });
        } else {
            updateData({ importantData: [...current, point] });
        }
    };

    const handleFeatureToggle = (feature: string) => {
        const current = data.clientPortalFeatures || [];
        if (current.includes(feature)) {
            updateData({ clientPortalFeatures: current.filter(f => f !== feature) });
        } else {
            updateData({ clientPortalFeatures: [...current, feature] });
        }
    };

    const isFormValid = () => {
        return data.clientCount && data.crmSystem;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
                <p className="mt-1 text-sm text-gray-500">
                    How do you interact with your customers?
                </p>
            </div>

            <div className="space-y-6">
                {/* 4.1 Customer Base */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Approximately how many active clients/customers do you serve?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {clientCountOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`count-${option}`}
                                    name="clientCount"
                                    type="radio"
                                    checked={data.clientCount === option}
                                    onChange={() => updateData({ clientCount: option })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">How do you currently manage customer information?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {crmOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`crm-${option}`}
                                    name="crmSystem"
                                    type="radio"
                                    checked={data.crmSystem === option}
                                    onChange={() => updateData({ crmSystem: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`crm-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What customer data is most important to track? (Check all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dataPoints.map((pt) => (
                            <div key={pt} className="flex items-center">
                                <input
                                    id={`data-${pt}`}
                                    type="checkbox"
                                    checked={data.importantData?.includes(pt)}
                                    onChange={() => handleDataToggle(pt)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`data-${pt}`} className="ml-2 block text-sm text-gray-900">
                                    {pt}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4.2 Client Interaction */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Client Interaction</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you want clients to be able to:</label>
                        <div className="space-y-2">
                            {[
                                'Book appointments themselves',
                                'View service menus and pricing',
                                'Leave reviews/ratings',
                                'View your business profile publicly',
                                'Upload testimonials with photos'
                            ].map((feature) => (
                                <div key={feature} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.clientPortalFeatures?.includes(feature)}
                                        onChange={() => handleFeatureToggle(feature)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-900">{feature}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">How important is AI-powered CRM assistance to you?</label>
                        <select
                            value={data.aiCrmAssistance}
                            onChange={(e) => updateData({ aiCrmAssistance: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select importance</option>
                            <option value="very">Very important - I need smart suggestions</option>
                            <option value="somewhat">Somewhat important - Would be nice to have</option>
                            <option value="not">Not important - I prefer manual control</option>
                            <option value="unsure">Not sure what this means</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you currently follow up with clients who haven't returned?</label>
                        <select
                            value={data.clientFollowUp}
                            onChange={(e) => updateData({ clientFollowUp: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select option</option>
                            <option value="systematic">Yes, systematically</option>
                            <option value="inconsistent">Yes, but inconsistently</option>
                            <option value="wanted">No, but I'd like to</option>
                            <option value="not_needed">No, not needed for my business</option>
                        </select>
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

export default Step4ClientManagement;
