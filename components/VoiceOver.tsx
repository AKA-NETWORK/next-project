// components/VoiceOver.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

export default function VoiceOver() {
  const [text, setText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState<boolean>(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
        setIsLoadingVoices(false);
      };
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }
  }, []);

  const speak = () => {
    if (!synthRef.current || !text.trim()) return;
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voices[selectedVoice];
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Voice Generator</h2>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-[120px]"
      />
      
      {isLoadingVoices ? (
        <p>Loading voices...</p>
      ) : voices.length > 0 ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Voice:
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {voices.map((voice, index) => (
              <option key={voice.name} value={index}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>No voices available.</p>
      )}
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rate: {rate}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pitch: {pitch}</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Volume: {volume}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={speak}
          disabled={isSpeaking || !text.trim() || isLoadingVoices}
          className={`px-4 py-2 rounded-lg ${
            isSpeaking || !text.trim() || isLoadingVoices
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSpeaking ? 'Speaking...' : 'Play Speech'}
        </button>
        
        <button
          onClick={stop}
          disabled={!isSpeaking}
          className={`px-4 py-2 rounded-lg ${
            !isSpeaking
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
