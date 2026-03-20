// Buffer polyfill for browser environment (required by Ledger libraries)
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
