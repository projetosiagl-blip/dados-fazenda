export default function Loading() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ height: 28, width: 200, backgroundColor: '#e8eee4', borderRadius: 6, marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 18, width: 280, backgroundColor: '#e8eee4', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.25rem' }}>
            <div style={{ height: 14, width: 120, backgroundColor: '#e8eee4', borderRadius: 4, marginBottom: '0.75rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 36, width: 60, backgroundColor: '#e8eee4', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.5rem', height: 320 }}>
          <div style={{ height: 20, width: 160, backgroundColor: '#e8eee4', borderRadius: 4, marginBottom: '1.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f4ec' }}>
              <div style={{ width: 36, height: 36, backgroundColor: '#e8eee4', borderRadius: 6, flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 14, backgroundColor: '#e8eee4', borderRadius: 4, marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <div style={{ height: 12, width: '60%', backgroundColor: '#e8eee4', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ backgroundColor: '#e8eee4', borderRadius: 8, height: 140, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, height: 160, animation: 'pulse 1.5s ease-in-out infinite' }} />
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
