import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoaderOverlay from './LoaderOverlay';

const NotificationContext = createContext(null);

export function useNotification() {
  return useContext(NotificationContext);
}

export default function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCenter, setOpenCenter] = useState(false);

  // showToast supports either (message, type, ttl) or an object { message, type, ttl, undo }
  const showToast = useCallback((arg1, arg2 = 'info', arg3 = 3000) => {
    const id = Date.now() + Math.random();
    let toast;
    if (typeof arg1 === 'string') {
      toast = { id, message: arg1, type: arg2, ttl: arg3 };
    } else {
      toast = { id, ...(arg1 || {}) };
    }
    setToasts((t) => [...t, toast]);
    if (toast.ttl > 0) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, toast.ttl);
    }
  }, []);

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const value = {
    showToast,
    setLoading,
    loading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <LoaderOverlay visible={loading} />

      <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 9999 }}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                marginBottom: 8,
                padding: '10px 14px',
                borderRadius: 8,
                color: '#fff',
                background: t.type === 'error' ? '#e53e3e' : t.type === 'success' ? '#16a34a' : '#334155',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                minWidth: 180,
              }}
              onClick={() => removeToast(t.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>{t.message}</div>
                <div style={{ marginLeft: 8, display: 'flex', gap: 8 }}>
                  {t.undo && (
                    <button onClick={() => { t.undo && t.undo(); removeToast(t.id); }} style={{ color: '#fff', background: 'transparent', border: 'none' }}>Undo</button>
                  )}
                  <button onClick={() => removeToast(t.id)} style={{ color: '#fff', background: 'transparent', border: 'none' }}>✕</button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Persistent center */}
      <div style={{ position: 'fixed', right: 16, top: 64, zIndex: 9999 }}>
        <button onClick={() => setOpenCenter((s) => !s)} style={{ padding: 6, borderRadius: 6 }}>
          {openCenter ? 'Close notifications' : 'Open notifications'}
        </button>
        {openCenter && (
          <div style={{ marginTop: 8, width: 320, maxHeight: 360, overflow: 'auto', background: '#0f172a', padding: 12, borderRadius: 8 }}>
            <h4 style={{ color: '#fff', marginTop: 0 }}>Notifications</h4>
            {toasts.length === 0 && <div style={{ color: '#94a3b8' }}>No notifications</div>}
            {toasts.map((t) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ color: '#fff' }}>{t.message}</div>
                <div>
                  {t.undo && <button onClick={() => { t.undo && t.undo(); removeToast(t.id); }} style={{ marginRight: 8 }}>Undo</button>}
                  <button onClick={() => removeToast(t.id)}>Close</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  );
}
