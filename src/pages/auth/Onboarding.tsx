
import { useOnboarding } from '../../contexts/OnboardingContext';
import Step1BusinessBasics from '../../components/onboarding/Step1BusinessBasics';
import Step2TeamStaffing from '../../components/onboarding/Step2TeamStaffing';

import Step3Scheduling from '../../components/onboarding/Step3Scheduling';
import Step4ClientManagement from '../../components/onboarding/Step4ClientManagement';

import Step5ServicesOfferings from '../../components/onboarding/Step5ServicesOfferings';

import Step6Compliance from '../../components/onboarding/Step6Compliance';

import Step7OperationsLogistics from '../../components/onboarding/Step7OperationsLogistics';
import Step8PayrollFinancials from '../../components/onboarding/Step8PayrollFinancials';

import Step9Communication from '../../components/onboarding/Step9Communication';

import Step10AppCustomization from '../../components/onboarding/Step10AppCustomization';

import Step11PriorityFeatures from '../../components/onboarding/Step11PriorityFeatures';

import Step12AdminSetup from '../../components/onboarding/Step12AdminSetup';

import Step13SummaryReview from '../../components/onboarding/Step13SummaryReview';

const Onboarding = () => {
    const { step, totalSteps } = useOnboarding();

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1BusinessBasics />;
            case 2:
                return <Step2TeamStaffing />;
            case 3:
                return <Step3Scheduling />;
            case 4:
                return <Step4ClientManagement />;
            case 5:
                return <Step5ServicesOfferings />;
            case 6:
                return <Step6Compliance />;
            case 7:
                return <Step7OperationsLogistics />;
            case 8:
                return <Step8PayrollFinancials />;
            case 9:
                return <Step9Communication />;
            case 10:
                return <Step10AppCustomization />;
            case 11:
                return <Step11PriorityFeatures />;
            case 12:
                return <Step12AdminSetup />;
            case 13:
                return <Step13SummaryReview />;
            default:
                return <div>Step {step} Coming Soon</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Setup Your Business
                </h2>
                <div className="mt-2">
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                    Step {step} of {totalSteps}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-blue-600">
                                    {Math.round((step / totalSteps) * 100)}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                            <div style={{ width: `${(step / totalSteps) * 100}% ` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
