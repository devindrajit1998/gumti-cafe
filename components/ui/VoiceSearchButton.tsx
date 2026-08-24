'use client';

import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const { showToast } = useApp();

  const startListening = () => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice Search Not Supported', 'Your browser does not support Web Speech API', 'info');
      return;
    }

    try {
      const recognition = new (SpeechRecognition as {
        new (): {
          lang: string;
          continuous: boolean;
          interimResults: boolean;
          onstart: () => void;
          onresult: (event: { results: Array<Array<{ transcript: string }>> }) => void;
          onerror: (err: unknown) => void;
          onend: () => void;
          start: () => void;
        };
      })();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... 🎙️', 'Speak dish or restaurant name (e.g. Biryani, Meghana, Dosa)', 'info');
      };

      recognition.onresult = (event: { results: Array<Array<{ transcript: string }>> }) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
          showToast(`Searching for: "${transcript}"`, undefined, 'success');
        }
      };

      recognition.onerror = (err: unknown) => {
        console.error('Speech recognition error', err);
        setIsListening(false);
        showToast('Voice recognition ended', 'Try speaking again or type in the search bar', 'info');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={startListening}
      title={isListening ? 'Listening...' : 'Voice Search'}
      className={`p-2 rounded-xl transition-all ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30 ring-2 ring-rose-300'
          : 'text-zinc-400 hover:text-orange-600 hover:bg-orange-50'
      } ${className}`}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
};
