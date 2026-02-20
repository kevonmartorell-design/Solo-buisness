import { useOnboarding } from '../../contexts/OnboardingContext';

const industries = [
    'Hair Salon / Beauty Services',
    'Legal Services / Law Firm',
    'Real Estate',
    'Security Services',
    'Restaurant / Food Service',
    'Retail / Shop',
    'Healthcare / Medical',
    'Automotive Services',
    'Fitness / Gym',
    'Home Services (Cleaning, Repair, etc.)',
    'Professional Services (Accounting, Consulting, etc.)',
    'Other',
];

const yearsInBusinessOptions = [
    'Less than 1 year',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years',
];

const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

const Step1BusinessBasics = () => {
    const { data, updateData, nextStep } = useOnboarding();

    const handleOperatingHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
        updateData({
            operatingHours: {
                ...data.operatingHours,
                [day]: {
                    ...data.operatingHours[day] || { open: '', close: '', closed: false },
                    [field]: value,
                },
            },
        });
    };

    const isFormValid = () => {
        return (
            data.businessName &&
            data.industry &&
            data.yearsInBusiness &&
            data.address &&
            data.city &&
            data.state &&
            data.zip &&
            data.country
        );
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Business Basics</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Let's get started with some information about your company.
                </p>
            </div>

            <div className="space-y-6">
                {/* 1.1 Company Information */}
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Legal Business Name</label>
                        <input
                            type="text"
                            value={data.businessName}
                            onChange={(e) => updateData({ businessName: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            placeholder="My Company LLC"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">DBA (Doing Business As) <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input
                            type="text"
                            value={data.dba || ''}
                            onChange={(e) => updateData({ dba: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>
                </div>

                {/* Industry */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                        value={data.industry}
                        onChange={(e) => updateData({ industry: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="">Select an industry</option>
                        {industries.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>

                {/* Years in Business */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">How long have you been in business?</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {yearsInBusinessOptions.map((option) => (
                            <div key={option} className="flex items-center">
                                <input
                                    id={`years-${option}`}
                                    name="yearsInBusiness"
                                    type="radio"
                                    checked={data.yearsInBusiness === option}
                                    onChange={() => updateData({ yearsInBusiness: option })}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <label htmlFor={`years-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Location</h3>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Street Address</label>
                            <input type="text" value={data.address} onChange={(e) => updateData({ address: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" value={data.city} onChange={(e) => updateData({ city: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">State / Province</label>
                            <input type="text" value={data.state} onChange={(e) => updateData({ state: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                            <input type="text" value={data.zip} onChange={(e) => updateData({ zip: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input type="text" value={data.country} onChange={(e) => updateData({ country: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center">
                        <input
                            id="multiple-locations"
                            type="checkbox"
                            checked={data.hasMultipleLocations}
                            onChange={(e) => updateData({ hasMultipleLocations: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="multiple-locations" className="ml-2 block text-sm text-gray-900">
                            I have multiple locations
                        </label>
                    </div>
                    {data.hasMultipleLocations && (
                        <div className="mt-2 sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">How many locations?</label>
                            <input type="number" value={data.locationCount || ''} onChange={(e) => updateData({ locationCount: parseInt(e.target.value) })} className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                    )}
                </div>

                {/* Operating Hours */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Operating Hours</h3>
                    <div className="space-y-2">
                        {daysOfWeek.map((day) => {
                            const hours = data.operatingHours[day] || { open: '', close: '', closed: false };
                            return (
                                <div key={day} className="grid grid-cols-[80px_auto] sm:grid-cols-[100px_80px_1fr_20px_1fr] items-center gap-2 py-1">
                                    <div className="text-sm font-medium text-gray-700">{day}</div>
                                    <div className="flex items-center">
                                        <input
                                            id={`closed-${day}`}
                                            type="checkbox"
                                            checked={hours.closed}
                                            onChange={(e) => handleOperatingHoursChange(day, 'closed', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <label htmlFor={`closed-${day}`} className="ml-2 text-sm text-gray-500 cursor-pointer">Closed</label>
                                    </div>
                                    {!hours.closed ? (
                                        <>
                                            <input
                                                type="time"
                                                value={hours.open}
                                                onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                            />
                                            <span className="text-gray-500 text-center">to</span>
                                            <input
                                                type="time"
                                                value={hours.close}
                                                onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                            />
                                        </>
                                    ) : (
                                        <div className="col-span-3 hidden sm:block"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex items-center">
                        <input
                            id="24-7"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={daysOfWeek.every(day => {
                                const hours = data.operatingHours[day];
                                return hours && !hours.closed && hours.open === '00:00' && hours.close === '23:59';
                            })}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    // Set to 24/7
                                    const newHours = { ...data.operatingHours };
                                    daysOfWeek.forEach(day => {
                                        newHours[day] = { open: '00:00', close: '23:59', closed: false };
                                    });
                                    updateData({ operatingHours: newHours });
                                } else {
                                    // Reset to default 9-5
                                    const newHours = { ...data.operatingHours };
                                    daysOfWeek.forEach(day => {
                                        newHours[day] = { open: '09:00', close: '17:00', closed: false };
                                    });
                                    updateData({ operatingHours: newHours });
                                }
                            }}
                        />
                        <label htmlFor="24-7" className="ml-2 block text-sm text-gray-900">
                            24/7 Operations
                        </label>
                    </div>
                </div>

            </div>

            <div className="flex justify-end pt-5">
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

export default Step1BusinessBasics;
