'use client';

import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Upload, Send, Music, Bot, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';

interface Message {
  id: string;
  type: 'user' | 'edgar';
  content: string;
  timestamp: Date;
  audioFile?: File;
}

export default function EdgarPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      // Add a message showing the uploaded file
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Uploaded: ${file.name}`,
        timestamp: new Date(),
        audioFile: file
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !audioFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      audioFile: audioFile || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate Edgar's response (replace with actual AI integration)
    setTimeout(() => {
      const edgarResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'edgar',
        content: audioFile 
          ? `I've analyzed your track "${audioFile.name}". Here are my mixing and mastering notes:\n\n**Mixing Notes:**\n- The low end could use some tightening around 80-120Hz\n- Consider adding some presence to the vocals around 2-4kHz\n- The stereo image could be widened slightly\n\n**Mastering Notes:**\n- Overall level is good, but watch for peaks in the chorus\n- Consider a gentle high-shelf boost above 10kHz for air\n- The track could benefit from subtle compression on the master bus\n\nWould you like me to elaborate on any of these points?`
          : "Hello! I'm Edgar, your AI music assistant. Upload an audio file and I'll analyze it to provide specific mixing and mastering feedback tailored to your track. What would you like to work on today?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, edgarResponse]);
      setIsLoading(false);
      setAudioFile(null);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="h-8 w-auto" />
              <div>
                <h1 className="text-2xl font-bold">Edgar</h1>
                <p className="text-sm text-muted-foreground">AI Music Assistant</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Chat with Edgar
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Upload an audio file to get started with Edgar's analysis</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.audioFile && (
                      <div className="mb-2 p-2 bg-background/20 rounded text-xs">
                        <Music className="w-4 h-4 inline mr-1" />
                        {message.audioFile.name}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Edgar is analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="space-y-4">
              {/* File Upload */}
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Audio
                </Button>
                {audioFile && (
                  <span className="text-sm text-muted-foreground">
                    {audioFile.name}
                  </span>
                )}
              </div>

              {/* Text Input */}
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Edgar about mixing, mastering, or production..."
                  className="flex-1 min-h-[60px] resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() && !audioFile}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
