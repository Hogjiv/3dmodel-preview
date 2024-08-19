/// <reference types="electron" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    APP_ROOT: string
    VITE_PUBLIC: string
  }
}

// Extend the Window interface to include the custom ipcRenderer methods
interface Window {
  ipcRenderer: {
    getUserData: () => Promise<{ id: number, name: string, email: string }>
    getSystemInfo: () => Promise<{ platform: string, release: string, cpu: string }>
    // Add other methods if needed
  }
}
