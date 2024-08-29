// src/global.d.ts

interface Window {
  API: {
    fetchData: () => Promise<{ message: string }>;
    fetchDataFromBackground: () => Promise<any>; // Замените any на правильный тип данных
    getSystemInfo: () => Promise<any>; // Замените any на правильный тип данных
    on: (event: string, listener: (event: any, ...args: any[]) => void) => void; // Замените any на правильные типы
  };
}
