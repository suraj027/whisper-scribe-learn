
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Headphones, Copy, Download, Loader2, Send, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Mock document data
const MOCK_DOCUMENT = {
  id: '1',
  name: 'Research Paper.pdf',
  date: '2023-05-15',
  type: 'pdf',
  size: '1.2 MB',
};

// Mock conversation for document questions
const INITIAL_CONVERSATION = [
  {
    id: '1',
    role: 'system',
    content: 'I can answer questions about this document. How can I help you today?',
  }
];

// Types for our message interface
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const DocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('questions');
  const [question, setQuestion] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isPodcastLoading, setPodcastLoading] = useState(false);
  const [podcastGenerated, setPodcastGenerated] = useState(false);
  const [podcastAudioUrl, setPodcastAudioUrl] = useState('');
  const [conversation, setConversation] = useState<Message[]>(INITIAL_CONVERSATION);
  const [isAsking, setIsAsking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle asking a question
  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    // Add user message to conversation
    const userMessage = { id: `msg-${Date.now()}`, role: 'user' as const, content: question };
    setConversation(prev => [...prev, userMessage]);
    setIsAsking(true);
    setQuestion('');
    
    // Scroll after message is added
    setTimeout(scrollToBottom, 100);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Fake AI response based on question (placeholder for actual API call)
      const response = `This is a simulated response to your question: "${question}". In a real implementation, this would call the Google Gemini API and retrieve an answer based on the document content.`;
      
      // Add AI response to conversation
      const aiMessage = { id: `msg-${Date.now()}`, role: 'assistant' as const, content: response };
      setConversation(prev => [...prev, aiMessage]);
      
      // Scroll after response is added
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setIsAsking(false);
    }
  };
  
  // Generate document summary
  const generateSummary = async () => {
    setIsSummaryLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock summary result
      const mockSummary = `This is a placeholder summary for document ID: ${id}. In a real implementation, this would contain an AI-generated summary from Google Gemini, limited to 500 words, highlighting key points from the document.

The summary would be structured to include:
• Main themes and concepts
• Key findings or arguments
• Important data points or evidence
• Conclusions and implications

This feature would analyze the full document content and synthesize the most relevant information into a cohesive overview that preserves the original meaning while condensing the length significantly.`;
      
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  };
  
  // Copy summary to clipboard
  const handleCopySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      // Use toast for success notification
    }
  };
  
  // Generate podcast from document
  const generatePodcast = async () => {
    setPodcastLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock podcast generation (in real implementation, this would use ElevenLabs)
      setPodcastGenerated(true);
      setPodcastAudioUrl('/placeholder.mp3'); // Placeholder URL
    } catch (error) {
      console.error('Error generating podcast:', error);
    } finally {
      setPodcastLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              {MOCK_DOCUMENT.name}
            </h1>
            <p className="text-muted-foreground">
              {MOCK_DOCUMENT.size} • Uploaded on {new Date(MOCK_DOCUMENT.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="podcast">Podcast</TabsTrigger>
          </TabsList>
          
          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ask Questions About This Document</CardTitle>
                <CardDescription>
                  Our AI will analyze the document content and provide relevant answers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages container */}
                <div className="border rounded-md h-[350px] overflow-y-auto p-4 bg-muted/30">
                  <div className="space-y-4">
                    {conversation.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 text-sm",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role !== "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2 max-w-[80%] break-words",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : message.role === "system"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.content}
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              U
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Input form */}
                <form
                  className="flex items-center space-x-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskQuestion();
                  }}
                >
                  <Input
                    placeholder="Ask a question about this document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isAsking}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!question.trim() || isAsking}
                  >
                    {isAsking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  Questions are analyzed against the document content only
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Summary</CardTitle>
                <CardDescription>
                  Generate a concise summary of up to 500 words
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary ? (
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 bg-muted/30">
                      <Textarea
                        value={summary}
                        readOnly
                        rows={10}
                        className="resize-none bg-transparent border-0 focus-visible:ring-0 p-0"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopySummary}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Generate a Summary</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-6 text-center max-w-md">
                      Our AI will read your document and create a clear, concise summary of the key points
                    </p>
                    <Button
                      onClick={generateSummary}
                      disabled={isSummaryLoading}
                    >
                      {isSummaryLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>Generate Summary</>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Podcast Tab */}
          <TabsContent value="podcast" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Podcast</CardTitle>
                <CardDescription>
                  Convert your document into an audio podcast with AI hosts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {podcastGenerated ? (
                  <div className="space-y-6">
                    <Alert>
                      <AlertTitle>Podcast Generated</AlertTitle>
                      <AlertDescription>
                        Your document has been converted to a podcast format with two AI hosts discussing the content
                      </AlertDescription>
                    </Alert>
                    
                    <div className="border rounded-md p-6 bg-muted/30">
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex -space-x-4">
                          <Avatar className="border-2 border-background">
                            <AvatarFallback className="bg-primary text-primary-foreground">H1</AvatarFallback>
                          </Avatar>
                          <Avatar className="border-2 border-background">
                            <AvatarFallback className="bg-secondary text-secondary-foreground">H2</AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="text-center font-medium">Document Discussion</h3>
                        <p className="text-sm text-center text-muted-foreground">
                          5:23 minutes • Generated on {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="w-full bg-black rounded-md p-3 flex items-center">
                        <audio ref={audioRef} controls className="w-full">
                          <source src={podcastAudioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download Audio
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Headphones className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg">Create an Audio Podcast</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-6 text-center max-w-md">
                      Convert your document into a podcast format with two AI hosts discussing the key points
                    </p>
                    <Button
                      onClick={generatePodcast}
                      disabled={isPodcastLoading}
                    >
                      {isPodcastLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Podcast...
                        </>
                      ) : (
                        <>
                          <Headphones className="mr-2 h-4 w-4" />
                          Generate Podcast
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-xs text-muted-foreground max-w-md text-center">
                  Podcast generation requires an ElevenLabs API key. Configure your API key in Settings.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DocumentPage;
