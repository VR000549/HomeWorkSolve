
import React, { useState } from 'react';
import CameraView from './components/CameraView';
import SolutionDisplay from './components/SolutionDisplay';
import { solveHomework } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartCamera = () => {
    setState(AppState.CAMERA);
  };

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setState(AppState.PROCESSING);
    setErrorMsg(null);
    
    try {
      const result = await solveHomework(imageData);
      setSolution(result);
      setState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setErrorMsg("Une erreur est survenue lors de l'analyse. Réessayez.");
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setSolution(null);
    setErrorMsg(null);
    setState(AppState.IDLE);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
            <i className="fas fa-brain"></i>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Gemini<span className="text-indigo-600">Solve</span></h1>
        </div>
        <div className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
          IA Devoirs
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {state === AppState.IDLE && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-lg text-center space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full"></div>
              <img 
                src="https://picsum.photos/id/1/600/400" 
                alt="Main" 
                className="w-64 h-64 object-cover rounded-3xl shadow-2xl relative border-4 border-white" 
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-2">
                <i className="fas fa-camera text-indigo-600 text-xl"></i>
                <span className="font-bold text-gray-700">Photo & Solution</span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 leading-tight">
                Tes devoirs résolus en un <span className="text-indigo-600">clic</span>.
              </h2>
              <p className="text-gray-500 text-lg">
                Prends en photo ton exercice de maths, français ou science et laisse l'IA de Gemini t'expliquer la solution.
              </p>
            </div>

            <button 
              onClick={handleStartCamera}
              className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <i className="fas fa-camera"></i>
              Commencer maintenant
            </button>
            
            <p className="text-sm text-gray-400">
              Prise en charge de l'écriture manuscrite et imprimée.
            </p>
          </div>
        )}

        {state === AppState.CAMERA && (
          <CameraView 
            onCapture={handleCapture} 
            onCancel={handleReset} 
          />
        )}

        {state === AppState.PROCESSING && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-robot text-indigo-600 text-2xl animate-pulse"></i>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">L'IA réfléchit...</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                Analyse de ton image et préparation d'une explication étape par étape.
              </p>
            </div>
            {capturedImage && (
              <div className="mt-8 opacity-50 grayscale scale-90 transition-all duration-1000">
                 <img src={capturedImage} alt="Analysing..." className="w-48 rounded-lg shadow-sm" />
              </div>
            )}
          </div>
        )}

        {state === AppState.RESULT && solution && (
          <SolutionDisplay 
            solution={solution} 
            imageUrl={capturedImage || undefined} 
            onReset={handleReset} 
          />
        )}

        {state === AppState.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-800">Mince !</h3>
              <p className="text-gray-500">{errorMsg || "Une erreur inconnue s'est produite."}</p>
            </div>
            <button 
              onClick={handleReset}
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        Propulsé par <span className="font-bold text-indigo-400">Google Gemini</span> • 2024
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default App;
