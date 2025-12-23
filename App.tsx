import React, { useState, useRef, useCallback } from 'react';
import { generatePosterData } from './services/geminiService';
import { PosterData, GenerationState } from './types';
import { PosterCanvas } from './components/PosterCanvas';
import { Download, Loader2, Paintbrush, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setState({ isLoading: true, error: null, data: null });

    try {
      const data = await generatePosterData(inputValue);
      setState({ isLoading: false, error: null, data });
    } catch (err: any) {
      setState({
        isLoading: false,
        error: err.message || "Failed to generate poster.",
        data: null,
      });
    }
  };

  const handleDownload = useCallback(() => {
    if (!svgRef.current || !state.data) return;

    const svgElement = svgRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();
    // Use encodeURIComponent to handle Unicode characters properly
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

    img.onload = () => {
      // Fill white background for PNG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${state.data?.titleEN.replace(/\s+/g, '_')}_Poster.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  }, [state.data]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-800 font-sans selection:bg-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-full mb-4">
            <Paintbrush className="w-6 h-6 text-slate-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-slate-900">
            Minimalist Poster AI
          </h1>
          <p className="text-slate-500 max-w-md mx-auto font-light">
            Enter a movie or novel title. We'll design a unique, geometric, minimalist poster for you.
          </p>
        </header>

        {/* Input Section */}
        <div className="w-full max-w-xl mb-12">
          <form onSubmit={handleGenerate} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g., The Matrix, 1984, Spirited Away..."
              className="w-full px-6 py-4 text-lg bg-white border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-transparent transition-all placeholder:text-slate-300"
              disabled={state.isLoading}
            />
            <button
              type="submit"
              disabled={state.isLoading || !inputValue.trim()}
              className="absolute right-2 p-3 bg-slate-900 text-white rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </button>
          </form>
          {state.error && (
            <p className="mt-4 text-red-500 text-center text-sm bg-red-50 py-2 px-4 rounded-lg">
              {state.error}
            </p>
          )}
        </div>

        {/* Main Content Area */}
        <div className="w-full flex-1 flex flex-col items-center justify-center">
          {state.isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-20 opacity-50 animate-pulse">
              <div className="w-48 h-64 border-2 border-slate-200 border-dashed rounded flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
              </div>
              <p className="text-slate-400 font-light tracking-wide">Designing masterpiece...</p>
            </div>
          ) : state.data ? (
            <div className="flex flex-col items-center animate-fade-in-up">
              <PosterCanvas data={state.data} ref={svgRef} />
              
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200/50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          ) : (
             /* Empty State Placeholder */
            <div className="text-center text-slate-300 py-12">
               <div className="w-[300px] h-[400px] border border-slate-100 rounded flex items-center justify-center mx-auto mb-4 bg-white shadow-sm">
                  <span className="font-serif italic text-2xl opacity-20">Poster Space</span>
               </div>
            </div>
          )}
        </div>

        <footer className="mt-16 text-slate-400 text-xs font-light">
          <p>Generated by Gemini 2.5 Flash • SVG Vector Graphics</p>
        </footer>
      </div>

      {/* Global styles for animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
