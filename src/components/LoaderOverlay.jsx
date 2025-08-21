import React from 'react';

export default function LoaderOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
    }}>
      <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#fff', backdropFilter: 'blur(4px)' }}>
        Loading...
      </div>
    </div>
  );
}
