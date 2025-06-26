import React from 'react';

// Define smoothness options
export const smoothnessOptions = [
  { name: 'None', value: 0 },
  { name: 'Slight', value: 10 },
  { name: 'Medium', value: 30 },
  { name: 'High', value: 60 }
];

// Define aspect ratio options with adjusted card widths
export const aspectRatios = [
  { name: '16:9', value: 'RATIO_16_9', width: 420, height: 240, cardWidth: 'w-[450px]' }, // Wider card for 16:9
  { name: '4:3', value: 'RATIO_4_3', width: 240, height: 180, cardWidth: 'w-64' },
  { name: '1:1', value: 'RATIO_1_1', width: 230, height: 230, cardWidth: 'w-64' },
];

interface DrawingToolsProps {
  brushColor: string;
  brushRadius: number;
  brushSmoothness: number;
  currentAspectRatio: typeof aspectRatios[0];
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  onSmoothnessChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAspectRatioChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddShot: () => void;
  showTooltip?: boolean;
  showAddShot?: boolean;
}

const DrawingTools: React.FC<DrawingToolsProps> = ({
  brushColor,
  brushRadius,
  brushSmoothness,
  currentAspectRatio,
  setBrushColor,
  setBrushSize,
  onSmoothnessChange,
  onAspectRatioChange,
  onAddShot,
  showTooltip = true,
  showAddShot = true
}) => {
  return (
    <div className="flex flex-wrap items-center gap-5">
      {/* Color picker */}
      <div className='flex items-center gap-2'>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brush Color:</label>
        <input 
          type="color" 
          value={brushColor} 
          onChange={(e) => setBrushColor(e.target.value)}
          className="h-10 w-20 border border-gray-300 rounded"
        />
      </div>
      
      {/* Brush size picker */}
      <div className="flex space-x-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brush Size:</label>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={brushRadius} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-40"
          />
          <span className="ml-2">{brushRadius}px</span>
        </div>
      </div>
      
      {/* Smoothness Selector */}
      <div className="flex items-center">
        <span className="text-sm text-gray-600 mr-2">Smoothness:</span>
        <select 
          value={brushSmoothness}
          onChange={onSmoothnessChange}
          className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {smoothnessOptions.map(option => (
            <option key={option.name} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {showTooltip && (
          <div className="ml-2 relative group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 cursor-help" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="absolute left-0 bottom-full mb-2 w-48 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Higher smoothness creates more fluid lines but may feel less responsive. Adjust based on your drawing style.
            </div>
          </div>
        )}
      </div>

      {/* Aspect Ratio Selector */}
      <div className="flex items-center">
        <span className="text-sm text-gray-600 mr-2">Ratio:</span>
        <select 
          value={currentAspectRatio.name}
          onChange={onAspectRatioChange}
          className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {aspectRatios.map(ratio => (
            <option key={ratio.name} value={ratio.name}>
              {ratio.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Add Frame Button */}
      {showAddShot && (
        <button 
          onClick={onAddShot}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-lg shadow transition duration-200 text-sm"
        >
          Add Frame
        </button>
      )}
    </div>
  );
};

export default DrawingTools; 