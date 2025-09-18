'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Upload, Send, Music, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '../components/Logo';

interface Message {
  id: string;
  type: 'user' | 'edgar';
  content: string;
  timestamp: Date;
  audioFile?: File;
  fileId?: string;
  analysis?: any;
}

export default function EdgarPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setIsLoading(true);

      try {
        // Upload file to server
        const formData = new FormData();
        formData.append('audio', file);

        const uploadResponse = await fetch('/api/edgar/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }

        const uploadData = await uploadResponse.json();
        
        // Add a message showing the uploaded file
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: `Uploaded: ${file.name}`,
          timestamp: new Date(),
          audioFile: file,
          fileId: uploadData.fileId,
          analysis: uploadData.analysis
        };
        setMessages(prev => [...prev, newMessage]);

        // Automatically get analysis
        const analysisResponse = await fetch('/api/edgar/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: uploadData.fileId,
            userMessage: 'Analyze this track for mixing and mastering feedback',
            analysis: uploadData.analysis
          }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          const edgarResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'edgar',
            content: analysisData.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, edgarResponse]);
        }

      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'edgar',
          content: 'Sorry, there was an error uploading your file. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !audioFile) return;

    setHasStarted(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      audioFile: audioFile || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Find the most recent uploaded file's analysis data
      const lastUploadedMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.analysis && msg.fileId);

      if (lastUploadedMessage && lastUploadedMessage.analysis) {
        // Get AI analysis for the uploaded file
        const analysisResponse = await fetch('/api/edgar/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileId: lastUploadedMessage.fileId,
            userMessage: currentInput,
            analysis: lastUploadedMessage.analysis
          }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          const edgarResponse: Message = {
            id: (Date.now() + 1).toString(),
            type: 'edgar',
            content: analysisData.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, edgarResponse]);
        } else {
          throw new Error('Analysis failed');
        }
      } else {
        // No uploaded file, provide general response
        const edgarResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'edgar',
          content: "Hello! I'm edgar, your AI music assistant. Upload an audio file and I'll analyze it to provide specific mixing and mastering feedback tailored to your track. What would you like to work on today?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, edgarResponse]);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'edgar',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAudioFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="h-8 w-auto" />
              <div>
                <h1 className="text-2xl font-bold">edgar</h1>
                <p className="text-sm text-muted-foreground">AI Music Assistant</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!hasStarted ? (
          /* Initial State - ChatGPT Style */
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full space-y-8">
              {/* Welcome Message */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
                  <Image
                    src="/edgar.png"
                    alt="Edgar"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold">How can edgar help you today?</h2>
                <p className="text-muted-foreground text-lg">
                  Upload an audio file and I'll analyze it to provide specific mixing and mastering feedback tailored to your track.
                </p>
              </div>

              {/* Input Box */}
              <div className="space-y-4">
                {/* File Upload */}
                <div className="flex items-center justify-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Audio File
                  </Button>
                  {audioFile && (
                    <span className="text-sm text-muted-foreground">
                      {audioFile.name}
                    </span>
                  )}
                </div>

                {/* Text Input */}
                <div className="relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask edgar about mixing, mastering, or production..."
                    className="w-full min-h-[60px] resize-none pr-12 rounded-full border-2 border-gray-200 focus:border-gray-400 focus:ring-0 shadow-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() && !audioFile}
                    size="sm"
                    className="absolute right-2 top-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'edgar' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/edgar.png"
                        alt="edgar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.audioFile && (
                      <div className="mb-2 p-2 bg-background/20 rounded text-xs flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {message.audioFile.name}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground text-sm font-medium">U</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src="/edgar.png"
                      alt="Edgar"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>edgar is analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
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
                  <div className="flex-1 relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask edgar about mixing, mastering, or production..."
                      className="w-full min-h-[60px] resize-none rounded-full border-2 border-gray-200 focus:border-gray-400 focus:ring-0 shadow-sm pr-12"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() && !audioFile}
                      className="absolute right-2 top-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
