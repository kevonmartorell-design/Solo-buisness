import { createContext, useContext, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface AIContextType {
    messages: Message[];
    sendMessage: (content: string) => Promise<void>;
    loading: boolean;
    clearChat: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (content: string) => {
        if (!content.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            // Fetch Context for the AI
            const contextData = await fetchBusinessContext();

            // Mock AI Response for now (until we connect to a real LLM API)
            // In a production app, you'd call an Edge Function or API here.
            setTimeout(() => {
                const assistantMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: generateMockResponse(content, contextData),
                    timestamp: new Date().toISOString(),
                };
                setMessages(prev => [...prev, assistantMsg]);
                setLoading(false);
            }, 1500);

        } catch (error) {
            console.error('AI Chat Error:', error);
            setLoading(false);
        }
    };

    const fetchBusinessContext = async () => {
        if (!user) return null;

        try {
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('organization_id')
                .eq('id', user.id)
                .single();

            if (!profile?.organization_id) return null;

            const orgId = profile.organization_id;

            // Fetch summary stats
            const { data: expenses } = await (supabase as any)
                .from('expenses')
                .select('amount')
                .eq('organization_id', orgId);

            const { data: bookings } = await (supabase as any)
                .from('bookings')
                .select('service:services(price)')
                .eq('organization_id', orgId)
                .eq('status', 'completed');

            const totalExpenses = expenses?.reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0;
            const totalRevenue = bookings?.reduce((sum: number, b: any) => sum + (Number(b.service?.price) || 0), 0) || 0;

            return {
                revenue: totalRevenue,
                expenses: totalExpenses,
                profit: totalRevenue - totalExpenses,
                employeeCount: 0, // Mock for now
                businessName: 'Your Business'
            };
        } catch (e) {
            return null;
        }
    };

    const generateMockResponse = (input: string, context: any) => {
        const lower = input.toLowerCase();
        if (lower.includes('revenue') || lower.includes('profit')) {
            return `Based on your data, your current revenue is $${context?.revenue.toLocaleString()} and net profit is $${context?.profit.toLocaleString()}. Your profit margin is ${(context?.profit / context?.revenue * 100 || 0).toFixed(1)}%.`;
        }
        if (lower.includes('expense') || lower.includes('spend')) {
            return `You've spent $${context?.expenses.toLocaleString()} recently. Your largest category seems to be Supplies. I recommend checking your vendor contracts to see if we can optimize costs.`;
        }
        if (lower.includes('advice') || lower.includes('coach')) {
            return "As your AEGIS Coach, I recommend focusing on customer retention this month. Your booking frequency is consistent, but increasing return visits by 5% could boost your monthly profit by nearly 10%.";
        }
        return `I'm AEGIS AI, your business coach. I'm currently analyzing your ${context?.revenue > 0 ? 'growing revenue' : 'initial setup'}. How can I help you optimize your operations today?`;
    };

    const clearChat = () => setMessages([]);

    return (
        <AIContext.Provider value={{ messages, sendMessage, loading, clearChat }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) throw new Error('useAI must be used within an AIProvider');
    return context;
};
