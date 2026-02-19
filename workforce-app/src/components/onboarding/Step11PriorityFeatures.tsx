import { useOnboarding } from '../../contexts/OnboardingContext';

const currentSystemsOptions = [
    'Square / POS system',
    'QuickBooks / Accounting',
    'Google Calendar / Outlook',
    'Excel / Spreadsheets',
    'Slack / Teams',
    'None / Pen & Paper',
];

const priorityOptions = [
    'Easy Scheduling',
    'Time Tracking',
    'Payroll Integration',
    'Client CRM',
    'Inventory Management',
    'Mobile App for Staff',
    'Automated Notifications',
    'Reporting/Analytics',
];

const savvinessOptions = [
    'High - We love new tech',
    'Medium - We can learn',
    'Low - Keep it simple',
];

const fieldAccessOptions = [
    'Yes, it\'s essential for field workers',
    'Yes, but mostly for checking schedules',
    'No, we work from a fixed location',
];

const Step11PriorityFeatures = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleSystemToggle = (option: string) => {
        const current = data.currentSystems || [];
        if (current.includes(option)) {
            updateData({ currentSystems: current.filter(o => o !== option) });
        } else {
            updateData({ currentSystems: [...current, option] });
        }
    };

    const handlePriorityToggle = (option: string) => {
        const current = data.priorityFeatures || [];
        if (current.includes(option)) {
            updateData({ priorityFeatures: current.filter(o => o !== option) });
        } else {
            updateData({ priorityFeatures: [...current, option] });
        }
    };

    const isFormValid = () => {
        return data.techSavviness && data.fieldAccess;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Tech & Priorities</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Help us tailor the experience to your needs.
                </p>
            </div>

            <div className="space-y-6">
                {/* 11.1 Tech Stack */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What tools do you currently use? (Check all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentSystemsOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`sys-${option}`}
                                    type="checkbox"
                                    checked={data.currentSystems?.includes(option)}
                                    onChange={() => handleSystemToggle(option)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`sys-${option}`} className="ml-2 block text-sm text-gray-900">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What are your top priorities? (Select up to 3)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {priorityOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`pri-${option}`}
                                    type="checkbox"
                                    checked={data.priorityFeatures?.includes(option)}
                                    onChange={() => handlePriorityToggle(option)}
                                    disabled={!data.priorityFeatures?.includes(option) && (data.priorityFeatures?.length || 0) >= 3}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                                />
                                <label htmlFor={`pri-${option}`} className={`ml-2 block text-sm ${(!data.priorityFeatures?.includes(option) && (data.priorityFeatures?.length || 0) >= 3) ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Select at most 3 options.
                    </p>
                </div>

                {/* 11.2 Adoption */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How tech-savvy is your team?</label>
                    <div className="space-y-2">
                        {savvinessOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`sav-${option}`}
                                    name="techSavviness"
                                    type="radio"
                                    checked={data.techSavviness === option}
                                    onChange={() => updateData({ techSavviness: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`sav-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do employees need mobile access in the field?</label>
                    <div className="space-y-2">
                        {fieldAccessOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`field-${option}`}
                                    name="fieldAccess"
                                    type="radio"
                                    checked={data.fieldAccess === option}
                                    onChange={() => updateData({ fieldAccess: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`field-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
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

export default Step11PriorityFeatures;
