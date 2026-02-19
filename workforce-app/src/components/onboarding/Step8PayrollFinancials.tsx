import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const payrollOptions = [
    'I do it myself manually',
    'I use a payroll software (ADP, Gusto, etc.)',
    'I have an accountant/bookkeeper',
    'I don\'t have payroll yet',
];

const taxOptions = [
    'Yes, I need full support',
    'Yes, I need generating reports for my accountant',
    'No, I have this covered',
];

const reportingOptions = [
    'Profit & Loss (P&L)',
    'Expense tracking',
    'Revenue by service/product',
    'Employee commission/tips',
    'Sales tax reports',
];

const integrationOptions = [
    'QuickBooks',
    'Xero',
    'FreshBooks',
    'Wave',
    'Other',
    'None/Not needed',
];

const Step8PayrollFinancials = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    const handleReportingToggle = (option: string) => {
        const current = data.financialReporting || [];
        if (current.includes(option)) {
            updateData({ financialReporting: current.filter(o => o !== option) });
        } else {
            updateData({ financialReporting: [...current, option] });
        }
    };

    const isFormValid = () => {
        return data.payrollMethod && data.taxFilingHelp;
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Payroll & Financials</h2>
                <p className="mt-1 text-sm text-gray-500">
                    How do you manage your business finances?
                </p>
            </div>

            <div className="space-y-6">
                {/* 8.1 Payroll */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How do you currently process payroll?</label>
                    <div className="space-y-2">
                        {payrollOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`payroll-${option}`}
                                    name="payrollMethod"
                                    type="radio"
                                    checked={data.payrollMethod === option}
                                    onChange={() => updateData({ payrollMethod: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`payroll-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you need help with tax filing or preparation?</label>
                    <div className="space-y-2">
                        {taxOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`tax-${option}`}
                                    name="taxFilingHelp"
                                    type="radio"
                                    checked={data.taxFilingHelp === option}
                                    onChange={() => updateData({ taxFilingHelp: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`tax-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 8.2 Reporting */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Which financial reports are most important to you? (Check all that apply)</label>
                    <div className="space-y-2">
                        {reportingOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`report-${option}`}
                                    type="checkbox"
                                    checked={data.financialReporting?.includes(option)}
                                    onChange={() => handleReportingToggle(option)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`report-${option}`} className="ml-2 block text-sm text-gray-900">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you need to integrate with existing accounting software?</label>
                    <select
                        value={data.accountingIntegration}
                        onChange={(e) => updateData({ accountingIntegration: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Select software</option>
                        {integrationOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
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

export default Step8PayrollFinancials;
