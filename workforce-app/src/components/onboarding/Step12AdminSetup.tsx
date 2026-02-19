import { useOnboarding } from '../../contexts/OnboardingContext';

const supportLevelOptions = [
    'Do it yourself (Self-serve)',
    'Done with you (Guided onboarding)',
    'Done for you (White-glove setup)',
];

const Step12AdminSetup = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleSupportNeedToggle = (key: keyof typeof data.supportNeeds, value: boolean) => {
        updateData({
            supportNeeds: {
                ...data.supportNeeds,
                [key]: value
            }
        });
    };

    const isFormValid = () => {
        return data.startDate && data.supportLevel;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Admin Setup & Launch</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Let's get you ready for takeoff.
                </p>
            </div>

            <div className="space-y-6">
                {/* 12.1 Timeline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">When do you want to launch?</label>
                    <input
                        type="date"
                        value={data.startDate || ''}
                        onChange={(e) => updateData({ startDate: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                </div>

                {/* 12.2 Support */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What kind of support do you need? (Check all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.supportNeeds.setup}
                                onChange={(e) => handleSupportNeedToggle('setup', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Account Setup</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.supportNeeds.import}
                                onChange={(e) => handleSupportNeedToggle('import', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Data Import</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.supportNeeds.managerTraining}
                                onChange={(e) => handleSupportNeedToggle('managerTraining', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Admin/Manager Training</label>
                        </div>
                        {data.selectedTier !== 'solo' && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.supportNeeds.staffTraining}
                                    onChange={(e) => handleSupportNeedToggle('staffTraining', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Staff Training</label>
                            </div>
                        )}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.supportNeeds.ongoing}
                                onChange={(e) => handleSupportNeedToggle('ongoing', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Ongoing Support</label>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What is your preferred support level?</label>
                    <div className="space-y-2">
                        {supportLevelOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`sup-${option}`}
                                    name="supportLevel"
                                    type="radio"
                                    checked={data.supportLevel === option}
                                    onChange={() => updateData({ supportLevel: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`sup-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
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

export default Step12AdminSetup;
