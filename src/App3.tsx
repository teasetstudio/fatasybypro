import CanvasDraw from 'react-canvas-draw';
import { useState, useRef } from 'react';

const App = () => {
  const canvasRef = useRef<CanvasDraw | null>(null);
  const savedDataRef = useRef<any | null>(null);
  const imageRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [backgroundColor, setBackgroundColor] = useState('#f5f5f5');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(5);
  const [isBackgroundImage, setIsBackgroundImage] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      // save data is empty after clear()
      savedDataRef.current = canvasRef.current.getSaveData();
      imageRef.current = null;
      setIsBackgroundImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      console.log("Undo action performed");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Save current drawing state before changing background
      if (canvasRef.current) {
        savedDataRef.current = canvasRef.current.getSaveData();
      }
      // set to false to force a re-render
      setIsBackgroundImage(false);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImage = e.target?.result as string;
        imageRef.current = uploadedImage;
        setIsBackgroundImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundImage = () => {
    // Save current drawing state before removing background
    if (canvasRef.current) {
      savedDataRef.current = canvasRef.current.getSaveData();
    }
    
    // Clear background image state
    setIsBackgroundImage(false);
    imageRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrawStart = () => {
    setIsDrawing(true);
    console.log("Drawing started");
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
    console.log("Drawing ended");
    // Save the current drawing whenever drawing ends
    if (canvasRef.current) {
      // setSavedDrawing(canvasRef.current.getSaveData());
      savedDataRef.current = canvasRef.current.getSaveData();
    }
  };

  const saveCanvasData = () => {
    if (canvasRef.current) {
      const data = canvasRef.current.getSaveData();
      // setSavedDrawing(data);
      savedDataRef.current = data;
      console.log("Canvas data saved:", data);
      alert("Drawing saved to console. Check browser console for data.");
    }
  };
  
  const downloadDrawing = () => {
    if (canvasRef.current) {
      try {
        // Access the internal canvas element - this is implementation dependent
        // Using as any instead of @ts-ignore to work around type checking
        const canvasElement = (canvasRef.current as any).canvas?.drawing;
        
        if (canvasElement) {
          // Create a temporary link element
          const link = document.createElement('a');
          
          // Set the download attribute and file name
          link.download = 'canvas-drawing.png';
          
          // Convert the canvas to a data URL
          link.href = canvasElement.toDataURL('image/png');
          
          // Append to the document
          document.body.appendChild(link);
          
          // Trigger the download
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          
          console.log("Drawing downloaded as PNG");
        } else {
          console.error("Canvas element not found");
          alert("Could not access canvas element to download");
        }
      } catch (error) {
        console.error("Error downloading drawing:", error);
        alert("Error downloading drawing. See console for details.");
      }
    }
  };

  const getImageSrc = () => {
    if (isBackgroundImage && imageRef.current) {
      return imageRef.current;
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Drawing Canvas</h1>

        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brush Color</label>
            <input 
              type="color" 
              value={brushColor} 
              onChange={(e) => setBrushColor(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brush Size</label>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={brushRadius} 
              onChange={(e) => setBrushRadius(parseInt(e.target.value))}
              className="w-40"
            />
            <span className="ml-2">{brushRadius}px</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canvas Color</label>
            <input 
              type="color" 
              value={backgroundColor} 
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              ref={fileInputRef}
              className="text-sm"
            />
            {isBackgroundImage && (
              <button 
                onClick={removeBackgroundImage}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Remove Image
              </button>
            )}
          </div>
        </div>

        <div className="mb-2 text-sm font-semibold text-gray-700">
          Drawing Area {isDrawing ? "(Drawing...)" : "(Click and drag to draw)"}
        </div>
        <div 
          className="border-2 border-blue-500 rounded-lg shadow-md overflow-hidden mb-4" 
          style={{ minHeight: '400px', position: 'relative' }}
          onMouseDown={handleDrawStart}
          onMouseUp={handleDrawEnd}
          onMouseLeave={handleDrawEnd}
        >
          <CanvasDraw
            ref={canvasRef}
            brushColor={brushColor}
            brushRadius={brushRadius}
            lazyRadius={0}
            canvasWidth={600}
            canvasHeight={400}
            backgroundColor={backgroundColor}
            imgSrc={getImageSrc()}
            saveData={savedDataRef.current}
            hideGrid
            immediateLoading={true}
            onChange={() => console.log("Canvas changed")}
            key={`canvas-${isBackgroundImage ? 'with-img' : 'no-img'}`}
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Canvas
          </button>
          <button 
            onClick={handleUndo}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Undo
          </button>
          <button 
            onClick={saveCanvasData}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Data
          </button>
          <button 
            onClick={downloadDrawing}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Download PNG
          </button>
        </div>
        
        {isDrawing ? (
          <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
            Drawing mode active - drag to draw
          </div>
        ) : (
          <div className="mt-2 p-2 bg-blue-100 text-blue-800 rounded">
            Tips: Click and drag to draw. If drawing doesn&apos;t work, try the &quot;Draw Test Shape&quot; button to test the canvas.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
