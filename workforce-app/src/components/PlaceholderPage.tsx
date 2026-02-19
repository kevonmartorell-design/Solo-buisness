

const PlaceholderPage = ({ title }: { title: string }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-primary">construction</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                This feature module is currently under development. System integration pending.
            </p>
        </div>
    );
};

export default PlaceholderPage;
