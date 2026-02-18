import { useState, useRef, useEffect } from 'react';
import { useAI } from '../../contexts/AIContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    Brain,
    TrendingUp,
    AlertTriangle,
    Zap,
    Send,
    Bot,
    User as UserIcon,
    Sparkles,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AEGISAI = () => {
    const { messages, sendMessage, loading, clearChat } = useAI();
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    const quickActions = [
        "Analyze my revenue trends",
        "How can I reduce expenses?",
        "Predict next month's profit",
        "Give me business advice"
    ];

    return (
        <div className="flex flex-col h-screen bg-[#f8f6f6] dark:bg-[#151210] overflow-hidden font-display">
            {/* Header */}
            <header className="p-6 bg-white dark:bg-[#1c1816] border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#de5c1b] rounded-xl text-white shadow-lg shadow-[#de5c1b]/20">
                        <Brain className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-tight">AEGIS AI Intelligence</h1>
                        <p className="text-xs text-gray-500 font-bold uppercase">Business Strategy & Performance Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold border border-green-500/20 uppercase">
                        AI Model Active
                    </div>
                    <button
                        onClick={clearChat}
                        className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-wider transition-colors"
                    >
                        Clear Session
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Insights Panel (Desktop) */}
                <aside className="hidden lg:flex flex-col w-96 p-6 border-r border-gray-200 dark:border-white/5 space-y-6 overflow-y-auto">
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Predictive Insights</h2>

                        <div className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-[#de5c1b]">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Growth Forecast</span>
                            </div>
                            <p className="text-sm">Based on booking trends, your revenue is expected to grow by <span className="text-green-500 font-bold">12%</span> over the next 30 days.</p>
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '75%' }}
                                    className="h-full bg-green-500"
                                />
                            </div>
                        </div>

                        <div className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-yellow-500">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Labor Alert</span>
                            </div>
                            <p className="text-sm">You have high labor costs scheduled for Tuesday. AEGIS suggests reducing 1 shift to save <span className="font-bold underline">$150</span>.</p>
                        </div>

                        <div className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-purple-500">
                                <Zap className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Service Optimization</span>
                            </div>
                            <p className="text-sm">Your "Premium Massage" has the highest margin but lowest volume. Consider a targeted marketing push.</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Analysis</h2>
                        <div className="space-y-2">
                            {quickActions.map(action => (
                                <button
                                    key={action}
                                    onClick={() => sendMessage(action)}
                                    className="w-full text-left p-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-[#de5c1b]/10 hover:text-[#de5c1b] transition-all text-xs flex items-center justify-between group"
                                >
                                    {action}
                                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Chat Section */}
                <main className="flex-1 flex flex-col bg-white/50 dark:bg-black/20 backdrop-blur-sm relative">
                    {/* Chat Background Graphic */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                        <Brain className="w-96 h-96" />
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <div className="p-4 bg-[#de5c1b]/10 text-[#de5c1b] rounded-3xl animate-pulse">
                                    <Sparkles className="w-12 h-12" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Hello, I'm your AEGIS Coach.</h3>
                                    <p className="text-gray-500 max-w-sm mt-2">I have analyzed your business data and am ready to help you thrive. What's on your mind?</p>
                                </div>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-gray-200 dark:bg-white/10' : 'bg-[#de5c1b] text-white'
                                            }`}>
                                            {m.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                            ? 'bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5'
                                            : 'bg-white dark:bg-[#1c1816] border border-gray-200 dark:border-white/10'
                                            }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#de5c1b] text-white flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-4 bg-white dark:bg-[#1c1816] rounded-2xl flex gap-1">
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white dark:bg-[#1c1816] border-t border-gray-200 dark:border-white/5">
                        <div className="max-w-4xl mx-auto relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask AEGIS Coach anything about your business..."
                                className="w-full pl-6 pr-14 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#de5c1b]/20 focus:border-[#de5c1b] transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-2 p-3 bg-[#de5c1b] text-white rounded-xl hover:bg-[#de5c1b]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-center text-gray-500 font-bold uppercase tracking-widest mt-4">
                            AEGIS Coach uses your live data to generate insights. Accuracy is dependent on your input.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AEGISAI;
