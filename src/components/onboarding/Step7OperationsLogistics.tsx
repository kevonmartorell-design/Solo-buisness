import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const inventoryOptions = [
    'Yes, I sell products and need to track stock levels',
    'Yes, I use supplies for services and need to track usage',
    'No, I don\'t need inventory tracking',
];

const supplyOptions = [
    'Yes, I want to order directly through the app',
    'Yes, I just want to track orders made elsewhere',
    'No, I handle this separately',
];

const maintenanceOptions = [
    'Yes, I have equipment that needs regular service',
    'Yes, I have a fleet of vehicles',
    'No, not applicable',
];

const vendorOptions = [
    'Yes, I have multiple vendors to manage',
    'No, I purchase from general retailers',
];

const Step7OperationsLogistics = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const isFormValid = () => {
        return data.inventoryTracking && data.supplyOrdering;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Operations & Logistics</h2>
                <p className="mt-1 text-sm text-gray-500">
                    How do you handle the day-to-day running of your business?
                </p>
            </div>

            <div className="space-y-6">
                {/* 7.1 Inventory & Supplies */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you need to track inventory?</label>
                    <div className="space-y-2">
                        {inventoryOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`inv-${option}`}
                                    name="inventoryTracking"
                                    type="radio"
                                    checked={data.inventoryTracking === option}
                                    onChange={() => updateData({ inventoryTracking: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`inv-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How do you handle supply ordering?</label>
                    <div className="space-y-2">
                        {supplyOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`supply-${option}`}
                                    name="supplyOrdering"
                                    type="radio"
                                    checked={data.supplyOrdering === option}
                                    onChange={() => updateData({ supplyOrdering: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`supply-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7.2 Equipment & Vendors */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment & Vendors</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you need to track equipment maintenance or vehicle mileage?</label>
                        <div className="space-y-2">
                            {maintenanceOptions.map((option) => (
                                <div key={option} className="flex items-center">
                                    <input
                                        id={`maint-${option}`}
                                        name="equipmentMaintenance"
                                        type="radio"
                                        checked={data.equipmentMaintenance === option}
                                        onChange={() => updateData({ equipmentMaintenance: option })}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <label htmlFor={`maint-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you need to manage vendor relationships?</label>
                        <div className="space-y-2">
                            {vendorOptions.map((option) => (
                                <div key={option} className="flex items-center">
                                    <input
                                        id={`vendor-${option}`}
                                        name="vendorManagement"
                                        type="radio"
                                        checked={data.vendorManagement === option}
                                        onChange={() => updateData({ vendorManagement: option })}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                    />
                                    <label htmlFor={`vendor-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                        {option}
                                    </label>
                                </div>
                            ))}
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

export default Step7OperationsLogistics;
