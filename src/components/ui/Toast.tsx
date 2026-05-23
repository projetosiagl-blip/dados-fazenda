'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'

type ToastType = 'sucesso' | 'erro' | 'aviso'

interface ToastItem {
  id: string
  tipo: ToastType
  mensagem: string
}

interface ToastContextType {
  toast: (mensagem: string, tipo?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const ICONES = {
  sucesso: <CheckCircle size={17} color="#2d6a4f" />,
  erro: <XCircle size={17} color="#c0392b" />,
  aviso: <AlertTriangle size={17} color="#b7882c" />,
}

const ESTILOS = {
  sucesso: { border: '#b8dfc8', fundo: '#f0f9f4', texto: '#1e4d2b' },
  erro: { border: '#f5c6c6', fundo: '#fdf2f2', texto: '#c0392b' },
  aviso: { border: '#f0c040', fundo: '#fef9ec', texto: '#b7882c' },
}

function ToastItem({ item, onRemover }: { item: ToastItem; onRemover: (id: string) => void }) {
  const est = ESTILOS[item.tipo]

  useEffect(() => {
    const t = setTimeout(() => onRemover(item.id), 4000)
    return () => clearTimeout(t)
  }, [item.id, onRemover])

  return (
    <div style={{ backgroundColor: est.fundo, border: `1px solid ${est.border}`, borderRadius: 8, padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 280, maxWidth: 380, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', animation: 'slideIn 0.2s ease' }}>
      {ICONES[item.tipo]}
      <span style={{ flex: 1, fontSize: '0.875rem', color: est.texto, fontWeight: 500 }}>{item.mensagem}</span>
      <button onClick={() => onRemover(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: est.texto, opacity: 0.6, padding: '0.1rem' }}>
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remover = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const toast = useCallback((mensagem: string, tipo: ToastType = 'sucesso') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, tipo, mensagem }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => <ToastItem key={t.id} item={t} onRemover={remover} />)}
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}
