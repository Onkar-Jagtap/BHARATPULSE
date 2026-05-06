import React from 'react';
import { Send, User, Bot, Loader2, Minimize2, Maximize2, X, Sparkles } from 'lucide-react';
import { chatAssistant } from '@/src/services/gemini';
import { VoterRecord } from '@/src/lib/dataProcessor';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ChatAssistantProps {
  data: VoterRecord[];
}

export function ChatAssistant({ data }: ChatAssistantProps) {
  const [messages, setMessages] = React.useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Operational. I have analyzed ' + data.length + ' voter records. How can I assist your campaign strategy today?' }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);

    // Context preparation
    const topIssues = Array.from(new Set(data.slice(0, 10).map(v => v.mainIssue))).join(', ');
    const context = `Top issues: ${topIssues}. Total voters: ${data.length}. State breakdown: ${Array.from(new Set(data.map(v => v.state))).join(', ')}.`;
    
    try {
      const response = await chatAssistant(userQuery, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a synchronization error with the intelligence cloud. Please retry your query." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-in-out flex flex-col",
      isExpanded ? "w-[400px] h-[600px]" : "w-14 h-14"
    )}>
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-neon-purple rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:scale-110 transition-transform"
        >
          <MessageSquarePulse />
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full glass-card flex flex-col shadow-2xl border-neon-purple/30"
        >
          {/* Header */}
          <div className="bg-neon-purple/10 border-b border-white/10 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center relative">
                <Bot size={18} className="text-neon-purple" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold">BharatPulse Intelligence</h3>
                <p className="text-[10px] text-neon-purple uppercase font-black">Online / Gemini Core</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          >
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-3",
                msg.role === 'user' ? "flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === 'user' ? "bg-accent-blue/20" : "bg-neon-purple/20"
                )}>
                  {msg.role === 'user' ? <User size={14} className="text-accent-blue" /> : <Bot size={14} className="text-neon-purple" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-xs leading-relaxed max-w-[80%]",
                  msg.role === 'user' 
                    ? "bg-accent-blue/10 text-white rounded-tr-none" 
                    : "bg-white/5 text-white/80 rounded-tl-none border border-white/5"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center animate-pulse">
                  <Bot size={14} className="text-neon-purple" />
                </div>
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                  <Loader2 size={14} className="animate-spin text-neon-purple" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="relative group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about voter sentiment..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-neon-purple/50 transition-colors"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-neon-purple rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-[9px] text-white/20 mt-2 text-center uppercase tracking-widest font-bold">
              Powered by Google Gemini 1.5 Flash
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MessageSquarePulse() {
  return (
    <div className="relative">
      <Sparkles className="text-white animate-pulse" size={24} />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
    </div>
  );
}
