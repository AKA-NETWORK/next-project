// types.d.ts
declare global {
  interface Window {
    speechSynthesis: SpeechSynthesis;
  }
}

interface SpeechSynthesisVoice {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

interface SpeechSynthesis extends EventTarget {
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  getVoices(): SpeechSynthesisVoice[];
  onvoiceschanged: (() => void) | null;
}

declare class SpeechSynthesisUtterance {
  constructor(text?: string);
  text: string;
  lang: string;
  voice: SpeechSynthesisVoice | null;
  volume: number;
  rate: number;
  pitch: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
