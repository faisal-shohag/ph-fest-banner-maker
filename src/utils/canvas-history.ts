import * as  fabric  from 'fabric';

// Extend the fabric.Canvas interface to include our new properties and methods
declare module 'fabric' {
  interface Canvas {
    historyUndo: string[];
    historyRedo: string[]; // Added for redo functionality
    historyNextState: string;
    historyProcessing: boolean;
    extraProps?: string[]; // Assuming extraProps might be passed to toDatalessJSON

    historyInit(): void;
    historyNext(): string;
    historySaveAction(): void;
    undo(): void;
    redo(): void; // Added for redo functionality
  }
}

fabric.Canvas.prototype.historyInit = function (this: fabric.Canvas) {
  this.historyUndo = [];
  this.historyRedo = []; // Initialize redo stack
  this.historyNextState = this.historyNext();

  this.on({
    "object:added": this.historySaveAction,
    "object:removed": this.historySaveAction,
    "object:modified": this.historySaveAction,
    // Add other events if you want them to trigger a save, e.g., "object:transformed"
  });
};

fabric.Canvas.prototype.historyNext = function (this: fabric.Canvas): string {
  // Ensure extraProps is handled if it might be undefined
  console.log(this)
  return JSON.stringify(this);
};

fabric.Canvas.prototype.historySaveAction = function (this: fabric.Canvas) {
  if (this.historyProcessing) {
    return;
  }
   


  const json = this.historyNextState;
  this.historyUndo.push(json);
  // Clear redo history when a new action is performed
  this.historyRedo = [];
  this.historyNextState = this.historyNext();
};

fabric.Canvas.prototype.undo = function (this: fabric.Canvas) {
  this.historyProcessing = true;
   
  

  const history:any = this.historyUndo.pop();
  console.log(JSON.parse(history));
  if (history) {
    // Before loading the previous state, save the current state to redo stack
    this.historyRedo.push(this.historyNextState); // Push the current state (which was historyNextState) to redo
    this.loadFromJSON(history, () => {
      this.renderAll();
      // After loading, the new historyNextState should be the one we just loaded
      this.historyNextState = history; // Update historyNextState to reflect the loaded state
      this.historyProcessing = false;
    });
     setTimeout(() => {
      this.renderAll()
    }, 500)
  } else {
    this.historyProcessing = false;
  }
};

fabric.Canvas.prototype.redo = function (this: fabric.Canvas) {
  this.historyProcessing = true;

  const history = this.historyRedo.pop();
  if (history) {
    // Before loading the next state, save the current state to undo stack
    this.historyUndo.push(this.historyNextState); // Push the current state (which was historyNextState) to undo
    this.loadFromJSON(history, () => {
      this.renderAll();
      // After loading, the new historyNextState should be the one we just loaded
      this.historyNextState = history; // Update historyNextState to reflect the loaded state
      this.historyProcessing = false;
    });
  } else {
    this.historyProcessing = false;
  }
};

// Example Usage (assuming you have a fabric canvas instance)
/*
// In your application code:
import { fabric } from 'fabric';
import './fabric-history'; // Import the file where you defined the above code

const canvas = new fabric.Canvas('myCanvas');
canvas.historyInit();

// Now you can use canvas.undo() and canvas.redo()
// For example, after adding an object:
const rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 50,
  height: 50
});
canvas.add(rect);

// To undo:
// document.getElementById('undoButton').addEventListener('click', () => {
//   canvas.undo();
// });

// To redo:
// document.getElementById('redoButton').addEventListener('click', () => {
//   canvas.redo();
// });
*/