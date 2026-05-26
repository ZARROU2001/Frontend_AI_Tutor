declare global {
  interface Window {
    __env: any;
  }
}

export const environment = {
  production: true,
  apiUrl: window.__env?.API_URL || 'http://localhost:8000/api'
};




