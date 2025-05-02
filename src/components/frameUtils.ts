import CanvasDraw from "react-canvas-draw";

// Helper function to create empty canvas data
export const createEmptyCanvasData = (width: number, height: number) => {
  // Ensure width and height are valid numbers
  const validWidth = typeof width === 'number' && !isNaN(width) && width > 0 ? width : 400;
  const validHeight = typeof height === 'number' && !isNaN(height) && height > 0 ? height : 400;
  
  // Create a valid empty canvas data structure
  const emptyData = {
    lines: [],
    width: validWidth,
    height: validHeight
  };
  
  try {
    // Validate by parsing and stringifying
    return JSON.stringify(emptyData);
  } catch (error) {
    console.error("Error creating empty canvas data:", error);
    // Fallback to hardcoded string if JSON.stringify fails
    return '{"lines":[],"width":400,"height":400}';
  }
};

// Helper function to safely get canvas data
export const safelyGetCanvasData = (canvas: CanvasDraw | null, width: number, height: number) => {
  if (!canvas) {
    return createEmptyCanvasData(width, height);
  }
  
  try {
    const saveData = canvas.getSaveData();
    
    // Validate that it's a non-empty string
    if (!saveData || saveData.trim() === '') {
      return createEmptyCanvasData(width, height);
    }
    
    // Validate JSON format
    try {
      const parsedData = JSON.parse(saveData);
      
      // Ensure the parsed data has the expected structure
      if (!parsedData.lines || !Array.isArray(parsedData.lines)) {
        console.error("Invalid canvas data structure from getSaveData");
        return createEmptyCanvasData(width, height);
      }
      
      return saveData;
    } catch (jsonError) {
      console.error("Error parsing JSON from getSaveData:", jsonError);
      return createEmptyCanvasData(width, height);
    }
  } catch (error) {
    console.error("Error getting canvas data:", error);
    return createEmptyCanvasData(width, height);
  }
};

// Helper function to safely load canvas data
export const safelyLoadCanvasData = (canvas: CanvasDraw | null, saveData: string, width: number, height: number, immediate = false) => {
  if (!canvas) {
    return;
  }
  
  try {
    // Validate that it's a non-empty string
    if (!saveData || saveData.trim() === '') {
      console.log("Empty save data provided, using empty canvas");
      canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
      return;
    }
    
    // Validate JSON format
    try {
      const parsedData = JSON.parse(saveData);

      // Ensure the parsed data has the expected structure
      if (!parsedData.lines || !Array.isArray(parsedData.lines)) {
        console.error("Invalid canvas data structure, missing lines array");
        canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
        return;
      }

      // Ensure the width and height are present
      if (typeof parsedData.width !== 'number' || typeof parsedData.height !== 'number') {
        console.error("Invalid canvas data structure, missing width or height");
        canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
        return;
      }
      
      // If we got here, the data is valid
      canvas.loadSaveData(saveData, immediate);
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      console.error("Invalid JSON data:", saveData);
      canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
    }
  } catch (error) {
    console.error("Error loading canvas data:", error);
    try {
      canvas.loadSaveData(createEmptyCanvasData(width, height), immediate);
    } catch (fallbackError) {
      console.error("Critical error, even fallback failed:", fallbackError);
    }
  }
};