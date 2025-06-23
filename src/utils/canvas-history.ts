import { Canvas } from 'fabric';

type HistoryEventCallback = () => void;

class HistoryFeature {
    private canvas: any;
    private historyUndo: string[];
    private historyRedo: string[];
    private extraProps: string[];
    private historyNextState: string;
    private historyProcessing: boolean;
    private historyUndoIndex:number

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.historyUndo = [];
        this.historyRedo = [];
        this.extraProps = ['selectable', 'editable'];
        this.historyNextState = this._historyNext();
        this.historyProcessing = false;
        this.historyUndoIndex = 0;
        this._historyInit();
        
        // Save initial state
        setTimeout(() => {
            this._historySaveAction();
        }, 1000);
    }

    private _historyNext(): string {
        return JSON.stringify(this.canvas.toDatalessJSON(this.extraProps));
    }

    private _historyEvents() {
        return {
            'object:added': this._historySaveAction.bind(this),
            'object:removed': this._historySaveAction.bind(this),
            'object:modified': this._historySaveAction.bind(this),
            'object:skewing': this._historySaveAction.bind(this),
            'path:created': this._historySaveAction.bind(this), // For drawing paths
        };
    }

    private _historyInit() {
        this.canvas.on(this._historyEvents());
    }

    // private _historyDispose() {
    //     this.canvas.off(this._historyEvents());
    // }

    private _historySaveAction() {
        if (this.historyProcessing) return;

        const json = this.historyNextState;
        this.historyUndo.push(json);
        this.historyUndoIndex++;
        this.historyRedo = []; 
        this.historyNextState = this._historyNext();
        this.canUndo()
        
        // console.log('History saved, undo stack:', this.historyUndo);
        // console.log('History saved, redo stack:', this.historyRedo);
        // console.log('History undo index:', this.historyUndoIndex);
        this.canvas.fire('history:append', { json: json });
    }

    undo(callback?: HistoryEventCallback) {
        if (!this.canUndo()) return;
        if(this.historyUndoIndex <= 2) return
        this.historyUndoIndex--;
        console.log(this.historyUndoIndex)
        
        this.historyProcessing = true;

        const history = this.historyUndo.pop();
        if (history) {
            this.historyNextState = history;
             this.historyRedo.push(this.historyNextState);
            this._loadHistory(history, 'history:undo', callback);
        } else {
            this.historyProcessing = false;
        }
    }

    redo(callback?: HistoryEventCallback) {
        if (!this.canRedo()) return;
        
        this.historyProcessing = true;

        const history = this.historyRedo.pop();
        if (history) {
            // Save current state to undo stack
            this.historyUndo.push(this.historyNextState);
            this.historyNextState = history;
            this._loadHistory(history, 'history:redo', callback);
        } else {
            this.historyProcessing = false;
        }
    }

    private _loadHistory(history: string, event: any, callback?: HistoryEventCallback) {
        this.canvas.loadFromJSON(history).then(()=>{
          this.canvas.renderAll();
            this.canvas.fire(event);
            this.historyProcessing = false;

            if (callback) callback();
        });
    }

    clearHistory() {
        this.historyUndo = [];
        this.historyRedo = [];
        this.historyNextState = this._historyNext();
        this.canvas.fire('history:clear');
    }

    onHistory() {
        this.historyProcessing = false;
        this._historySaveAction();
    }

    canUndo(): boolean {
        return this.historyUndoIndex > 2;
    }

    canRedo(): boolean {
        return this.historyRedo.length > 0;
    }

    offHistory() {
        this.historyProcessing = true;
    }

    // Debug method to check history state
    getHistoryState() {
        return {
            undoLength: this.historyUndo.length,
            redoLength: this.historyRedo.length,
            processing: this.historyProcessing
        };
    }
}

export default HistoryFeature;