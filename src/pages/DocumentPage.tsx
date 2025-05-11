import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { MoreVertical, Loader2, Copy, Check, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import AppLayout from '@/components/layout/AppLayout';

// Define the Message type
type Message = {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
};

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock data for testing
    setDocumentTitle('ResearchAI Demo Document');
    const initialMessages: Message[] = [
      { id: '1', role: 'system', content: 'You are a helpful AI assistant.' },
      { id: '2', role: 'user', content: 'Hello, can you summarize the main points of the article on quantum computing?' },
      { id: '3', role: 'assistant', content: 'Certainly! After reviewing the article, the main points on quantum computing are...' },
    ];
    setMessages(initialMessages);
  }, [id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input,
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `This is a simulated AI response to your message: "${input}". The AI is processing your request...`,
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      toast.error('Failed to get AI response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success('Content copied to clipboard!');

    // Revert back after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="container relative min-h-screen">
        {/* Document Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{documentTitle}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Message History */}
        <div className="mb-6">
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                  <Badge
                    variant="secondary"
                    className="ml-2"
                  >
                    {message.role}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyClick(message.content)}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Card className="w-full mt-2">
                <CardContent>
                  <p className="text-sm">{message.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
          <div ref={bottomRef} /> {/* Scroll anchor */}
        </div>

        <Separator className="my-4" />

        {/* Input Area */}
        <div className="sticky bottom-0 bg-background p-4 rounded-md">
          <div className="flex items-center space-x-2">
            <Textarea
              placeholder="Enter your message..."
              value={input}
              onChange={handleInputChange}
              className="flex-grow"
              rows={3}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading</span>
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocumentPage;
