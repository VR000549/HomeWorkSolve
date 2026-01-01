
import React from 'react';

interface SolutionDisplayProps {
  solution: string;
  imageUrl?: string;
  onReset: () => void;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution, imageUrl, onReset }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
          <i className="fas fa-graduation-cap"></i>
          Solution du Devoir
        </h2>
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
        >
          Nouveau Scan
        </button>
      </div>

      {imageUrl && (
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
          <img src={imageUrl} alt="Homework capture" className="w-full max-h-64 object-contain bg-gray-50" />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-indigo-50">
        <div className="prose prose-indigo max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
          {solution}
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-blue-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Conseil : Vérifie toujours les résultats par toi-même pour t'assurer d'avoir bien compris le raisonnement !
            </p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onReset}
        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
      >
        Scanner un autre devoir
      </button>
    </div>
  );
};

export default SolutionDisplay;
