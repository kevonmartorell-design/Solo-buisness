import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const employeeCountOptions = [
    '1-5 employees',
    '6-10 employees',
    '11-15 employees',
    '16-20 employees',
    '21-30 employees',
    '30+ employees',
];

const growthOptions = [
    'No growth planned',
    '1-5 new employees',
    '6-10 new employees',
    '10+ new employees',
    'Downsizing',
];

const rolesOptions = [
    'Owner/Founder',
    'General Manager',
    'District/Regional Manager',
    'Store/Location Manager',
    'Assistant Manager',
    'Department Manager',
    'Shift Lead/Supervisor',
    'Team Lead',
    'HR Coordinator',
    'Administrative Assistant',
    'Bookkeeper/Accountant',
    'Marketing Coordinator',
    'Compliance/Safety Officer',
    'Front-line Associates/Staff',
    'Other',
];

const Step2TeamStaffing = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleRoleToggle = (role: string) => {
        const currentRoles = data.roles || [];
        if (currentRoles.includes(role)) {
            updateData({ roles: currentRoles.filter(r => r !== role) });
        } else {
            updateData({ roles: [...currentRoles, role] });
        }
    };

    const isFormValid = () => {
        return data.employeeCount && data.expectedGrowth && (data.roles && data.roles.length > 0);
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Team & Staffing</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Tell us about your team structure and size.
                </p>
            </div>

            <div className="space-y-6">
                {/* 2.1 Current Team Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How many employees do you currently have?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {employeeCountOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`emp-count-${option}`}
                                    name="employeeCount"
                                    type="radio"
                                    checked={data.employeeCount === option}
                                    onChange={() => updateData({ employeeCount: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`emp-count-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected growth over next 12 months?</label>
                    <select
                        value={data.expectedGrowth}
                        onChange={(e) => updateData({ expectedGrowth: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Select growth plan</option>
                        {growthOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* 2.2 Team Structure */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Which roles exist in your business? (Check all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rolesOptions.map((role) => (
                            <div key={role} className="flex items-center">
                                <input
                                    id={`role-${role}`}
                                    type="checkbox"
                                    checked={data.roles?.includes(role)}
                                    onChange={() => handleRoleToggle(role)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`role-${role}`} className="ml-2 block text-sm text-gray-900">
                                    {role}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">How many people are in leadership/management positions?</label>
                    <input
                        type="number"
                        min="0"
                        value={data.leadershipCount}
                        onChange={(e) => updateData({ leadershipCount: parseInt(e.target.value) || 0 })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Composition (%)</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500">Full-time</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={data.teamComposition?.fullTime}
                                onChange={(e) => updateData({ teamComposition: { ...data.teamComposition, fullTime: parseInt(e.target.value) || 0 } })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Part-time</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={data.teamComposition?.partTime}
                                onChange={(e) => updateData({ teamComposition: { ...data.teamComposition, partTime: parseInt(e.target.value) || 0 } })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Contractors</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={data.teamComposition?.contractors}
                                onChange={(e) => updateData({ teamComposition: { ...data.teamComposition, contractors: parseInt(e.target.value) || 0 } })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Seasonal</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={data.teamComposition?.seasonal}
                                onChange={(e) => updateData({ teamComposition: { ...data.teamComposition, seasonal: parseInt(e.target.value) || 0 } })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
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

export default Step2TeamStaffing;
