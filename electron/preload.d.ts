/// <reference types="electron" />

// Extend the Window interface to include the custom API methods
interface Window {
  API: {
    startScript: (data: any) => Promise<void>;
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    off: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    send: (channel: string, ...args: any[]) => void;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    onScriptRunning: (callback: (value: any) => void) => void;
    onModelList: (callback: (value: any) => void) => void;
    onModelImage: (callback: (value: any) => void) => void;
    onSetlList: (callback: (value: any) => void) => void;
    onModelSaved: (callback: (value: any) => void) => void;
    getSystemInfo: () => Promise<{ platform: string; release: string; cpu: string }>;
    fetchDataFromBackground: () => Promise<any>;
  };
}

// Additional NodeJS and ProcessEnv declarations if needed
declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true';
    APP_ROOT: string;
    VITE_PUBLIC: string;
  }
}
/// <reference types="electron" />

// Extend the Window interface to include the custom API methods
interface Window {
  API: {
    startScript: (data: any) => Promise<void>;
    on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    off: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    send: (channel: string, ...args: any[]) => void;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    onScriptRunning: (callback: (value: any) => void) => void;
    onModelList: (callback: (value: any) => void) => void;
    onModelImage: (callback: (value: any) => void) => void;
    onSetlList: (callback: (value: any) => void) => void;
    onModelSaved: (callback: (value: any) => void) => void;
    getSystemInfo: () => Promise<{ platform: string; release: string; cpu: string }>;
    fetchDataFromBackground: () => Promise<any>;
  };
}

// Additional NodeJS and ProcessEnv declarations if needed
declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true';
    APP_ROOT: string;
    VITE_PUBLIC: string;
  }
}
