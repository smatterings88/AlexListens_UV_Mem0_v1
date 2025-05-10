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
      <main className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-8">Voice AI Assistant</h1>
            <p className="text-xl mb-12">
              Experience natural conversations with our advanced AI assistant. 
              Get instant responses, transcriptions, and intelligent interactions 
              powered by cutting-edge voice technology.
            </p>
            
            <div className="space-y-8 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-3">Real-time Voice</h3>
                  <p>Natural conversations with instant voice responses</p>
                </div>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-3">Live Transcription</h3>
                  <p>See your conversation unfold in real-time text</p>
                </div>
                <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-3">Smart Memory</h3>
                  <p>AI remembers context for more natural dialogue</p>
                </div>
              </div>
            </div>

            <button
              onClick={startConversation}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-opacity-90 transition-colors"
            >
              Start Conversation
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Voice AI Assistant</h1>
        <p className="mb-4 text-gray-600">Status: {status}</p>
        <div className="mt-6 space-y-4">
          {transcripts.map((t, idx) => (
            <p key={idx} className="text-gray-700 p-3 bg-gray-50 rounded-lg">{t}</p>
          ))}
        </div>
      </div>
    </main>
  );
}