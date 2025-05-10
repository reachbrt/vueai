import { useState, useEffect, useCallback } from 'react';
import { AIClient } from '@/packages/vueai-core';
import { Message, UseChatEngineOptions, ChatEngineResult } from '../index';

export function useChatEngine({
  provider,
  apiKey,
  model,
  systemPrompt = '',
  streaming = true,
  initialMessages = []
}: UseChatEngineOptions): ChatEngineResult {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize with system prompt and initial messages
    const initMessages: Message[] = [];
    
    if (systemPrompt) {
      initMessages.push({ role: 'system', content: systemPrompt });
    }
    
    return [...initMessages, ...initialMessages];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Initialize AI client
  const aiClient = new AIClient({
    provider,
    apiKey,
    model
  });
  
  // Reset conversation
  const resetConversation = useCallback(() => {
    setMessages(systemPrompt 
      ? [{ role: 'system', content: systemPrompt }] 
      : []
    );
    setError(null);
  }, [systemPrompt]);
  
  // Send message
  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to chat
      const userMessage: Message = { role: 'user', content };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      if (streaming) {
        // Use streaming API
        let assistantMessage = '';
        
        await aiClient.streamChat([...messages, userMessage], {
          onStart: () => {
            // Add empty assistant message that will be filled
            setMessages(prevMessages => [
              ...prevMessages, 
              { role: 'assistant', content: '' }
            ]);
          },
          onToken: (token) => {
            assistantMessage += token;
            // Update the last message with the accumulated tokens
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1] = {
                role: 'assistant',
                content: assistantMessage
              };
              return updatedMessages;
            });
          },
          onComplete: () => {
            setIsLoading(false);
          },
          onError: (err) => {
            setError(err);
            setIsLoading(false);
          }
        });
      } else {
        // Use regular completion API
        const response = await aiClient.chat([...messages, userMessage]);
        
        // Add assistant response to chat
        setMessages(prevMessages => [...prevMessages, response]);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  }, [aiClient, messages, streaming]);
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetConversation
  };
}
