'use client';
import { useEffect, useRef, useState } from 'react';

export default function VoiceControls() {
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [text, setText] = useState('');

  useEffect(() => {
    const load = () => {
      const available = synthRef.current.getVoices();
      if (available.length) {
        setVoices(available);
        setIsLoadingVoices(false);
      } else {
        synthRef.current.onvoiceschanged = () => {
          setVoices(synthRef.current.getVoices());
          setIsLoadingVoices(false);
        };
      }
    };
    load();
  }, []);

  const speak = () => {
    if (!text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    setIsSpeaking(true);
    try {
      synthRef.current.speak(utterance);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
    } catch (e) {
      console.error('Speech synthesis failed:', e);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Voice Controls</h2>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type text to speak..."
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 min-h-[100px]"
      />
      
      {isLoadingVoices ? (
        <p className="mb-4">Loading voices...</p>
      ) : (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Voice:
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rate: {rate}
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pitch: {pitch}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Volume: {volume}
          </label>
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
      
      <div className="flex gap-3">
        <button
          onClick={speak}
          disabled={isSpeaking || !text.trim()}
          className={`px-4 py-2 rounded-lg ${
            isSpeaking || !text.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSpeaking ? 'Speaking...' : 'Speak'}
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
