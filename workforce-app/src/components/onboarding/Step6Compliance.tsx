import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const storageOptions = [
    'Yes, I need to store employee certifications/licenses',
    'Yes, I need to store business permits/insurance docs',
    'Yes, I need to store client contracts/forms',
    'No, I don\'t have major document storage needs',
];

const trackingOptions = [
    'Yes, strict requirement (fines/legal issues if expired)',
    'Yes, internal requirement (policy)',
    'No, not critical',
];

const alertOptions = [
    '30 days before',
    '60 days before',
    '90 days before',
    'Custom timeframe',
];

const Step6Compliance = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleStorageToggle = (option: string) => {
        const current = data.documentStorageNeeds || [];
        if (current.includes(option)) {
            updateData({ documentStorageNeeds: current.filter(o => o !== option) });
        } else {
            updateData({ documentStorageNeeds: [...current, option] });
        }
    };

    const isFormValid = () => {
        return (data.documentStorageNeeds && data.documentStorageNeeds.length > 0) && data.complianceTracking;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Compliance & Vault</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your important documents and licenses.
                </p>
            </div>

            <div className="space-y-6">
                {/* 6.1 Document Management */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What kind of documents do you need to store securely? (Check all that apply)</label>
                    <div className="space-y-2">
                        {storageOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`storage-${option}`}
                                    type="checkbox"
                                    checked={data.documentStorageNeeds?.includes(option)}
                                    onChange={() => handleStorageToggle(option)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`storage-${option}`} className="ml-2 block text-sm text-gray-900">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you need to track expiration dates for licenses/certifications?</label>
                    <div className="space-y-2">
                        {trackingOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`track-${option}`}
                                    name="complianceTracking"
                                    type="radio"
                                    checked={data.complianceTracking === option}
                                    onChange={() => updateData({ complianceTracking: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`track-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {data.complianceTracking && data.complianceTracking.startsWith('Yes') && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">When do you want to be alerted about expirations?</label>
                        <select
                            value={data.expirationAlerts}
                            onChange={(e) => updateData({ expirationAlerts: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select alert timing</option>
                            {alertOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                )}

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

export default Step6Compliance;
