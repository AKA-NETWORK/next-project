import VoiceControls from '@/components/VoiceControls';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Next.js Voice Control Demo
        </h1>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm">
          <VoiceControls />
        </div>
      </div>
    </main>
  );
}
