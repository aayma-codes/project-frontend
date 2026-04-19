import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Minimize2 } from 'lucide-react';
import Button from './Button';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm KamaiBot. How can I help you today with your earnings or platform grievances?" }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const scrollRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen && !sessionId && user) {
      createSession();
    }
  }, [isOpen, sessionId, user]);

  const createSession = async () => {
    try {
      const res = await api.post('/api/chat/sessions', { title: `Chat with ${user.name}` });
      setSessionId(res.data.id);
    } catch (error) {
      console.error('Failed to create chat session');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.toLowerCase();
    setInput('');

    // Demo responses for when backend is down or no session
    if (!sessionId) {
      setTimeout(() => {
        let botReply = "I'm in demo mode right now. Once the backend is connected, I can help you with real data!";
        if (currentInput.includes('hello') || currentInput.includes('hi')) botReply = "Hello! How can I help you explore KamaiKitab today?";
        if (currentInput.includes('earnings')) botReply = "You can track your earnings from FoodPanda, Bykea, and InDrive in the Worker Portal.";
        if (currentInput.includes('certificate')) botReply = "Our Income Certificates are verified by community peers and can be used for bank loans or rent.";
        if (currentInput.includes('grievance')) botReply = "You can report unfair deactivations anonymously through our Grievance Board.";
        
        setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
      }, 600);
      return;
    }

    try {
      const res = await api.post(`/api/chat/sessions/${sessionId}/messages`, { content: input });
      setMessages(prev => [...prev, { role: 'bot', content: res.data.content || "I'm processing your request." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting to the live server. But I'm here to help with general info!" }]);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-[60]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-dark transition-colors border-4 border-white"
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 z-[60] w-[380px] h-[550px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-border/40 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">KamaiAssistant</h3>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Online Now</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Minimize2 size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F9F7F5]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-text rounded-tl-none border border-border/40 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-border/40 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-background rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
