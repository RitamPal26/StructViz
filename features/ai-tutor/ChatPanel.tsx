import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Image as ImageIcon, X, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { generateTutorResponse, analyzeStructureImage, ChatMessage } from '../../services/ai';
import { Button } from '../../shared/components/Button';

interface ChatPanelProps {
  context: string;
  onHighlightNode?: (val: number) => void;
  onBuildStructure?: (values: number[]) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ context, onHighlightNode, onBuildStructure }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm your AI Tutor. Ask me anything about ${context}, or upload a drawing of a tree!` }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const response = await generateTutorResponse(
      messages.slice(-5), // Keep context window small for demo
      input, 
      context,
      onHighlightNode
    );

    setIsThinking(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview message
    setMessages(prev => [...prev, { role: 'user', text: `Uploaded image: ${file.name}` }]);
    setIsThinking(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const numbers = await analyzeStructureImage(base64);
      
      setIsThinking(false);
      if (numbers && numbers.length > 0) {
        setMessages(prev => [...prev, { role: 'model', text: `I found these numbers: ${numbers.join(', ')}. Building structure now!` }]);
        if (onBuildStructure) onBuildStructure(numbers);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "I couldn't quite see a structure in that image. Try drawing clearer numbers!" }]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Basic Speech to Text using Web Speech API
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input not supported in this browser");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };
    
    recognition.start();
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-2xl text-white hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className="fixed top-20 bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white">Gemini Tutor</h3>
              </div>
              <span className="text-xs text-green-400 font-mono flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                Online
              </span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-700">
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <div className="flex items-center space-x-2 bg-gray-800 rounded-xl p-2 border border-gray-700 focus-within:border-indigo-500 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                  title="Upload Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm min-w-0"
                />

                <button
                  onClick={toggleVoice}
                  className={`p-2 transition-colors ${isListening ? 'text-red-400 animate-pulse' : 'text-gray-400 hover:text-indigo-400'}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <button
                  onClick={handleSend}
                  className="p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
