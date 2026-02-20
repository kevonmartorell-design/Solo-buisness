import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
    insights: {
        revenue: number;
        profit: number;
        expenses: number;
        revenueTrend: number;
        laborIssues: number;
        topService: string;
        employeeCount: number;
        businessName: string;
    } | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<AIContextType['insights']>(null);

    // Load insights on mount
    useEffect(() => {
        fetchBusinessContext().then(setInsights);
    }, [user]);

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

            // 1. Fetch Organization Details
            const { data: org } = await (supabase as any)
                .from('organizations')
                .select('business_name')
                .eq('id', orgId)
                .single();

            // 2. Fetch Employee Count
            const { count: empCount } = await (supabase as any)
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('organization_id', orgId);

            // 3. Revenue Trends (Last 30 days vs Prior 30 days)
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

            const { data: recentBookings } = await (supabase as any)
                .from('bookings')
                .select('service:services(price)')
                .eq('organization_id', orgId)
                .eq('status', 'completed')
                .gte('created_at', thirtyDaysAgo);

            const { data: priorBookings } = await (supabase as any)
                .from('bookings')
                .select('service:services(price)')
                .eq('organization_id', orgId)
                .eq('status', 'completed')
                .gte('created_at', sixtyDaysAgo)
                .lt('created_at', thirtyDaysAgo);

            const recentRevenue = recentBookings?.reduce((sum: number, b: any) => sum + (Number(b.service?.price) || 0), 0) || 0;
            const priorRevenue = priorBookings?.reduce((sum: number, b: any) => sum + (Number(b.service?.price) || 0), 0) || 0;
            const revenueTrend = priorRevenue === 0 ? 0 : ((recentRevenue - priorRevenue) / priorRevenue) * 100;

            // 4. Labor Issues (Shifts with low margin)
            // Note: PostgREST doesn't support column comparison in filter directly (lt(bill_rate, pay_rate * 1.5))
            // So we fetch shifts and filter in JS
            const { data: shifts } = await (supabase as any)
                .from('shifts')
                .select('pay_rate, bill_rate')
                .eq('organization_id', orgId);

            const riskyShifts = shifts?.filter((s: any) => {
                const pay = Number(s.pay_rate) || 0;
                const bill = Number(s.bill_rate) || 0;
                return bill < pay * 1.5;
            }) || [];

            // 5. Total Expenses
            const { data: expenses } = await (supabase as any)
                .from('expenses')
                .select('amount')
                .eq('organization_id', orgId);

            // 6. Top Service
            const { data: serviceStats } = await (supabase as any)
                .from('bookings')
                .select('service:services(name)')
                .eq('organization_id', orgId)
                .eq('status', 'completed');

            const serviceCounts: Record<string, number> = {};
            serviceStats?.forEach((b: any) => {
                const name = b.service?.name || 'Unknown';
                serviceCounts[name] = (serviceCounts[name] || 0) + 1;
            });
            const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

            const totalExpenses = expenses?.reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0;

            return {
                revenue: recentRevenue,
                expenses: totalExpenses,
                profit: recentRevenue - totalExpenses,
                revenueTrend: Math.round(revenueTrend),
                laborIssues: riskyShifts.length,
                topService,
                employeeCount: empCount || 0,
                businessName: org?.business_name || 'Your Business'
            };
        } catch (e) {
            console.error('Error fetching business context:', e);
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
        <AIContext.Provider value={{ messages, sendMessage, loading, clearChat, insights }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (!context) throw new Error('useAI must be used within an AIProvider');
    return context;
};
