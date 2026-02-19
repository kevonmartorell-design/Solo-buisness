import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const toolOptions = [
    'Slack/Microsoft Teams (Internal team chat)',
    'Email (Business email)',
    'SMS/Text Messaging (Client notifications)',
    'Phone System (VoIP/Landline)',
    'Video Conferencing (Zoom/Meet)',
    'Project Management Tools (Asana/Trello)',
];

const messagingOptions = [
    'Yes, I need a dedicated business phone number/SMS',
    'Yes, I need automated client emails/texts',
    'No, I use my personal phone/email',
    'No, communication is not a priority',
];

const Step9Communication = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleToolToggle = (option: string) => {
        const current = data.communicationTools || [];
        if (current.includes(option)) {
            updateData({ communicationTools: current.filter(o => o !== option) });
        } else {
            updateData({ communicationTools: [...current, option] });
        }
    };

    const isFormValid = () => {
        return data.customerMessaging;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Communication</h2>
                <p className="mt-1 text-sm text-gray-500">
                    How do you stay in touch with your team and clients?
                </p>
            </div>

            <div className="space-y-6">
                {/* 9.1 Tools */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What communication tools do you currently use? (Check all that apply)</label>
                    <div className="space-y-2">
                        {toolOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`tool-${option}`}
                                    type="checkbox"
                                    checked={data.communicationTools?.includes(option)}
                                    onChange={() => handleToolToggle(option)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`tool-${option}`} className="ml-2 block text-sm text-gray-900">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you need professional messaging features?</label>
                    <div className="space-y-2">
                        {messagingOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`msg-${option}`}
                                    name="customerMessaging"
                                    type="radio"
                                    checked={data.customerMessaging === option}
                                    onChange={() => updateData({ customerMessaging: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`msg-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
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

export default Step9Communication;
