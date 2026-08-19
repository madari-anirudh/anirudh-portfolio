import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Madari Anirudh - Software & AI Engineer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617', // tailwind slate-950
          backgroundImage: 'radial-gradient(circle at 50% -20%, #1e40af 0%, #020617 70%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Fake Terminal UI Dots */}
        <div style={{ position: 'absolute', top: 40, left: 40, display: 'flex', gap: '12px' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#eab308' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#22c55e' }} />
        </div>

        {/* Content Container */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.2)',
              color: '#60a5fa', // blue-400
              fontSize: 24,
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              marginBottom: 30,
              textTransform: 'uppercase',
            }}
          >
            Full-Stack & AI Engineer
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: 85,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: 'white',
              margin: '0 0 20px 0',
            }}
          >
            Madari Anirudh
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 32,
              color: '#94a3b8', // slate-400
              maxWidth: '850px',
              textAlign: 'center',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Specializing in high-performance web systems, full-stack applications, and intelligent AI architectures.
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}