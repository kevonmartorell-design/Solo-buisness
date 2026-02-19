import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const schedulingMethods = [
    'Pen and paper',
    'Excel/Google Sheets',
    'Another scheduling software',
    'No formal system',
    'Verbal communication only',
];

const advanceSchedulingOptions = [
    'Same day',
    '1-3 days ahead',
    '1 week ahead',
    '2 weeks ahead',
    '1 month ahead',
    'Varies/Irregular',
];

const changeFrequencyOptions = [
    'Never',
    'Rarely (once a month)',
    'Sometimes (2-3 times per month)',
    'Often (weekly)',
    'Constantly (multiple times per week)',
];

const challengesOptions = [
    'Last-minute shift changes',
    'Employee availability tracking',
    'Overtime management',
    'Shift coverage gaps',
    'Time-off request management',
    'Fair schedule distribution',
    'Communication of schedule changes',
    'Employee shift swapping',
    'No major challenges',
    'Other',
];

const Step3Scheduling = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleChallengeToggle = (challenge: string) => {
        const current = data.schedulingChallenges || [];
        if (current.includes(challenge)) {
            updateData({ schedulingChallenges: current.filter(c => c !== challenge) });
        } else {
            updateData({ schedulingChallenges: [...current, challenge] });
        }
    };

    const handleWorkflowChange = (key: keyof typeof data.approvalWorkflows, value: boolean) => {
        updateData({
            approvalWorkflows: {
                ...data.approvalWorkflows,
                [key]: value
            }
        });
    };

    const isFormValid = () => {
        return data.schedulingMethod && data.advanceScheduling && data.scheduleChangeFrequency;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Scheduling Needs</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Help us understand how you manage your team's time.
                </p>
            </div>

            <div className="space-y-6">
                {/* 3.1 Current Process */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How do you currently manage employee schedules?</label>
                    <select
                        value={data.schedulingMethod}
                        onChange={(e) => updateData({ schedulingMethod: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Select a method</option>
                        {schedulingMethods.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">How far in advance do you create schedules?</label>
                        <select
                            value={data.advanceScheduling}
                            onChange={(e) => updateData({ advanceScheduling: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select timeframe</option>
                            {advanceSchedulingOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">How often do schedules change after publishing?</label>
                        <select
                            value={data.scheduleChangeFrequency}
                            onChange={(e) => updateData({ scheduleChangeFrequency: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select frequency</option>
                            {changeFrequencyOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Biggest scheduling challenges? (Check all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {challengesOptions.map((opt) => (
                            <div key={opt} className="flex items-center">
                                <input
                                    id={`challenge-${opt}`}
                                    type="checkbox"
                                    checked={data.schedulingChallenges?.includes(opt)}
                                    onChange={() => handleChallengeToggle(opt)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`challenge-${opt}`} className="ml-2 block text-sm text-gray-900">
                                    {opt}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3.2 Features Needed */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Features Needed</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you need approval workflows for:</label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.approvalWorkflows.timeOff}
                                    onChange={(e) => handleWorkflowChange('timeOff', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Time-off requests</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.approvalWorkflows.shiftSwaps}
                                    onChange={(e) => handleWorkflowChange('shiftSwaps', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Shift swaps</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.approvalWorkflows.scheduleChanges}
                                    onChange={(e) => handleWorkflowChange('scheduleChanges', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Schedule changes</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.approvalWorkflows.overtime}
                                    onChange={(e) => handleWorkflowChange('overtime', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Overtime</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do employees need to clock in/out within the app?</label>
                        <select
                            value={data.timeTracking}
                            onChange={(e) => updateData({ timeTracking: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select option</option>
                            <option value="location">Yes, with location verification</option>
                            <option value="simple">Yes, without location verification</option>
                            <option value="no">No, we track time another way</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you work with appointments/bookings?</label>
                        <select
                            value={data.appointmentBased}
                            onChange={(e) => updateData({ appointmentBased: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Select option</option>
                            <option value="yes_primary">Yes, appointment-based business</option>
                            <option value="yes_some">Yes, some services require appointments</option>
                            <option value="no_walkin">No, walk-in only</option>
                            <option value="no_other">No, different business model</option>
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

export default Step3Scheduling;
