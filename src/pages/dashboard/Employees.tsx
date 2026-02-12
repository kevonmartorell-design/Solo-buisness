

const Employees = () => {
    const employees = [
        { id: 1, name: 'John Anderson', role: 'Master Electrician', status: 'green', lastVerified: '2 days ago', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK0flJ7Zg8JclAz15-32kG5o8xdfskh1KXoSRyV4Om24lyZ17BM7NGN9XbkOX19Pp0lQSyrQLKXuHCp1QnPQjGbE_V1BDnvOZgEsk4mVoYYVefQsZgDeh4wmR3q1pUHoYm9QUSzA2TrWeai302_JBAOeGYwxVz1Jf29fmZhjzl7D_EKlIvbFRzbZYT98OIL1dxdUHXYT6eUP91ywDiXgpPV5Pu6F2x6Mb1CVconUs2ZvXgZ_IY3kVTdl7UkXZsL8C7ji2dI5E7LMQ' },
        { id: 2, name: 'Sarah Jenkins', role: 'Project Supervisor', status: 'yellow', lastVerified: '1 week ago', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVBTQ2ug02Kr9vrDf2SWk_3P8DT1DPZoTSxMMMQ-O2s2AB0kQCAaIeFt4iEOQasrYq3U0pneDnkl4VDl6ou19uJhbZ8dhwfohBs0_jVvewIWT_7vQA-dMb7LW3vVKBU1VzZ1vydpw3Ef4Xorqt0fjiPWrlWLQDVSeKXcdnof-KP2k6VyjGBqJS9SbwdCIU6t2eNbgVuxdR3badRN8aS1iXDIa1-BLlhJJlGlv6TJBjBeXPmd-ulQ9TaQPVavVAjzWtvVU3EX8jWe0' },
        { id: 3, name: 'Michael Chen', role: 'HVAC Specialist', status: 'red', lastVerified: 'Expired', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-vUswO2vsMFqoJOQ6Bu-CCysrIJeDEvmXKn14l06DNcMP5IiS2_hR92CBKrj_4VMTXGdCz2klITFewr6z09P_FPjI06_i63X48BMcJESB0YTTBZRphBjHmIoFVy9oIERgkydRMnvWs749V8IIEXNDVIhAuuVQ27u3oAO0AYH8QhBf-hlEoICh9FZssTsqBQBNURtXgcfz9O3RMrcj_gLvo4-1sEmXgrAe4rmnNOalPUz6xr5m0O1QiUXeM6E_AM__ixDd7ZxyKzU' },
        { id: 4, name: 'Emma Rodriguez', role: 'Crane Operator', status: 'green', lastVerified: 'Verified today', imgUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzW0l_7n_7YG_VJxm9SzOLR1u5tDkBj1js7UVTj72aqUXuBbYYZe20VyPCji11hVOLsQkg-rsYkAr-aDCbkNsMFyeJkQ0VFhb6m1A8U_uvqMHKPAIdkYiaFBdwcnuhHBaUNB-92KLb4UbZT6iwtlpZlEyvBQIR4BHsBdQzRUSivivYPJn2WXes9GnrN-sn_uxAYAFevEUcoxtIM3eCHvxsD8xhQbFw_VzXW7vq5aU8-CWbmcqp9NnoZm6XjzeO94XP4_WUdsj_GLk' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Team Overview</h2>
                <div className="flex gap-2">
                    <button className="whitespace-nowrap bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">All Workers ({employees.length})</button>
                    <button className="whitespace-nowrap bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-sm font-medium">Valid</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((emp) => (
                    <div key={emp.id} className="bg-white dark:bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-4 hover:border-primary/40 transition-colors group cursor-pointer">
                        <div className="relative">
                            <div
                                className={`w-16 h-16 rounded-full bg-cover bg-center border-2 ${emp.status === 'green' ? 'border-emerald-500' :
                                    emp.status === 'yellow' ? 'border-amber-500' : 'border-red-500'
                                    }`}
                                style={{ backgroundImage: `url('${emp.imgUrl}')` }}
                            ></div>
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-background-dark ${emp.status === 'green' ? 'bg-emerald-500' :
                                emp.status === 'yellow' ? 'bg-amber-500' : 'bg-red-500'
                                }`}></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{emp.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{emp.role}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">chevron_right</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Employees;
