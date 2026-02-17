import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const brandImportanceOptions = [
    'Critical - My brand must be front and center',
    'Important - I want it to look professional',
    'Not a priority - Functionality matters more',
];

const whitelabelOptions = [
    'Yes, I want to remove all references to Workforce App',
    'No, "Powered by Workforce" is fine',
    'Unsure',
];

const Step10AppCustomization = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleAssetToggle = (key: keyof typeof data.brandAssets, value: boolean) => {
        updateData({
            brandAssets: {
                ...data.brandAssets,
                [key]: value
            }
        });
    };

    const isFormValid = () => {
        return data.brandImportance && data.whitelabel;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">App Customization</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Make the app feel like your own.
                </p>
            </div>

            <div className="space-y-6">
                {/* 10.1 Branding */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How important is branding to you?</label>
                    <div className="space-y-2">
                        {brandImportanceOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`imp-${option}`}
                                    name="brandImportance"
                                    type="radio"
                                    checked={data.brandImportance === option}
                                    onChange={() => updateData({ brandImportance: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`imp-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you have existing brand assets? (Check all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.brandAssets.logo}
                                onChange={(e) => handleAssetToggle('logo', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Logo</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.brandAssets.colors}
                                onChange={(e) => handleAssetToggle('colors', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Color Palette</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.brandAssets.fonts}
                                onChange={(e) => handleAssetToggle('fonts', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Fonts</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.brandAssets.guidelines}
                                onChange={(e) => handleAssetToggle('guidelines', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Brand Guidelines</label>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Are you interested in a white-labeled mobile app?</label>
                    <div className="space-y-2">
                        {whitelabelOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`white-${option}`}
                                    name="whitelabel"
                                    type="radio"
                                    checked={data.whitelabel === option}
                                    onChange={() => updateData({ whitelabel: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`white-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Custom Domain (Optional)</label>
                    <input
                        type="text"
                        value={data.customDomain || ''}
                        onChange={(e) => updateData({ customDomain: e.target.value })}
                        placeholder="portal.mybusiness.com"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
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

export default Step10AppCustomization;
