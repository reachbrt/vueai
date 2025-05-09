import React, { useState, useRef, useEffect } from 'react';
import { useChatEngine } from '../hooks/useChatEngine';
import { ApiConfig, Message } from '../index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RefreshCw, Maximize, Send } from 'lucide-react';

export interface AiChatWindowProps {
  apiConfig: ApiConfig;
  initialMessages?: Message[];
  systemPrompt?: string;
  streaming?: boolean;
  onSend?: (message: string) => void;
  onResponse?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export function AiChatWindow({
  apiConfig,
  initialMessages = [],
  systemPrompt = '',
  streaming = true,
  onSend,
  onResponse,
  onError
}: AiChatWindowProps) {
  const [userInput, setUserInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    resetConversation 
  } = useChatEngine({
    provider: apiConfig.provider,
    apiKey: apiConfig.apiKey,
    model: apiConfig.model,
    systemPrompt,
    streaming,
    initialMessages
  });
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    // Call onError when error changes
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);
  
  useEffect(() => {
    // Call onResponse when a new assistant message is added
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant' && onResponse) {
      onResponse(messages[messages.length - 1]);
    }
  }, [messages, onResponse]);
  
  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const message = userInput;
      setUserInput('');
      
      if (onSend) {
        onSend(message);
      }
      
      await sendMessage(message);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <Card className="shadow-lg overflow-hidden flex flex-col h-full">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="9" r="3"></circle>
            <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"></path>
          </svg>
          <h3 className="font-medium">AI Chat</h3>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={resetConversation}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="h-80 overflow-y-auto p-4 bg-muted/20 flex-1">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start mb-4 text-sm ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 ${msg.role === 'user' ? 'ml-3' : 'mr-3'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {msg.role === 'user' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2"></path>
                    <path d="M20 14h2"></path>
                    <path d="M15 13v2"></path>
                    <path d="M9 13v2"></path>
                  </svg>
                )}
              </div>
            </div>
            <div className={`${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            } rounded-lg py-2 px-3 max-w-[85%]`}>
              <p className={msg.role === 'user' ? 'text-primary-foreground' : 'text-foreground'}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start mb-4 text-sm">
            <div className="flex-shrink-0 mr-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
            </div>
            <div className="bg-muted rounded-lg py-2 px-3 max-w-[85%]">
              <p className="text-foreground">Thinking...</p>
            </div>
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-r-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button 
            className="rounded-l-none"
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <div>Powered by @vueai/chatbot</div>
          <div>Model: {apiConfig.model || 'default'}</div>
        </div>
      </div>
    </Card>
  );
}
