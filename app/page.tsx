'use client';

import { useEffect, useRef, useState } from 'react';
import { UltravoxSession } from 'ultravox-client';

export default function HomePage() {
  const [session, setSession] = useState<UltravoxSession | null>(null);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('disconnected');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!isStarted) return;

    const initializeSession = async () => {
      const res = await fetch('/api/call', { method: 'POST' });
      const data = await res.json();
      const joinUrl = data.joinUrl;

      const uvSession = new UltravoxSession();
      uvSession.addEventListener('status', () => {
        setStatus(uvSession.status);
      });
      uvSession.addEventListener('transcripts', () => {
        const texts = uvSession.transcripts.map((t) => `${t.speaker}: ${t.text}`);
        setTranscripts(texts);
      });

      uvSession.joinCall(joinUrl);
      setSession(uvSession);
    };

    initializeSession();

    return () => {
      session?.leaveCall();
    };
  }, [isStarted]);

  const startConversation = () => {
    setIsStarted(true);
  };

  if (!isStarted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold">VoiceAI</div>
            <div className="flex gap-6">
              <a href="#features" className="hover:text-blue-200 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-200 transition-colors">About</a>
            </div>
          </nav>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              Your AI Conversation Partner
            </h1>
            <p className="text-2xl mb-12 text-blue-100">
              Experience natural conversations with our advanced AI assistant powered by 
              cutting-edge voice technology.
            </p>
            
            <button
              onClick={startConversation}
              className="bg-white text-purple-600 px-10 py-4 rounded-full text-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Talking Now
            </button>

            <div id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all">
                <h3 className="text-2xl font-semibold mb-4">Real-time Voice</h3>
                <p className="text-blue-100">Natural conversations with instant voice responses, just like talking to a friend</p>
              </div>
              <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all">
                <h3 className="text-2xl font-semibold mb-4">Live Transcription</h3>
                <p className="text-blue-100">Watch your conversation unfold with real-time text transcription</p>
              </div>
              <div className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all">
                <h3 className="text-2xl font-semibold mb-4">Smart Memory</h3>
                <p className="text-blue-100">Context-aware AI that remembers your conversations for more meaningful interactions</p>
              </div>
            </div>

            <div id="about" className="mt-24 bg-white/5 rounded-2xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-6">Why Choose VoiceAI?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Our advanced AI assistant combines natural language processing with 
                voice technology to create the most human-like conversation experience. 
                Perfect for learning, practicing languages, or just having an engaging chat.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Voice AI Assistant</h1>
        <p className="mb-4 text-gray-600">Status: {status}</p>
        <div className="mt-6 space-y-4">
          {transcripts.map((t, idx) => (
            <p key={idx} className="text-gray-700 p-4 bg-gray-50 rounded-xl">{t}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
