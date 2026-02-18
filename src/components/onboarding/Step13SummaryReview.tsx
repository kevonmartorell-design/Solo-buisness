import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../contexts/OnboardingContext';

const Step13SummaryReview = () => {
    const { data, prevStep, submitOnboarding } = useOnboarding();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await submitOnboarding();
            navigate('/dashboard'); // Or wherever you want to go after onboarding
        } catch (err) {
            console.error('Failed to submit onboarding:', err);
            setError('Failed to complete setup. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Review & Launch</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Review your information before we build your workspace.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-900">Business Basics</h3>
                        <p className="text-gray-600">{data.businessName}</p>
                        <p className="text-gray-600">{data.industry}</p>
                        <p className="text-gray-600">{data.city}, {data.state}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Team</h3>
                        <p className="text-gray-600">{data.employeeCount}</p>
                        {data.selectedTier !== 'solo' && <p className="text-gray-600">{data.roles.length} Roles Defined</p>}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Operations</h3>
                        <p className="text-gray-600">Scheduling: {data.schedulingMethod}</p>
                        {data.inventoryTracking && <p className="text-gray-600">Inventory: {data.inventoryTracking}</p>}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Priorities</h3>
                        <ul className="list-disc list-inside text-gray-600">
                            {data.priorityFeatures?.map((feat) => (
                                <li key={feat}>{feat}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {data.selectedTier && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900">Selected Plan</h3>
                        <p className="text-gray-600 font-medium capitalize">{data.selectedTier}</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-between pt-5">
                <button
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isSubmitting ? 'Building Workspace...' : 'Complete Setup'}
                </button>
            </div>
        </div>
    );
};

export default Step13SummaryReview;
