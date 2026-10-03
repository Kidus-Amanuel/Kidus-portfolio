import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kidus Amanuel - Full-Stack AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ background: '#000000', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '12px solid #ffffff' }}>
        <div style={{ display: 'flex', fontSize: 80, fontWeight: 800, color: 'white', marginBottom: 20, letterSpacing: '-0.05em' }}>
          Kidus Amanuel.
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#a3a3a3', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Full-Stack & AI Engineer
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 40, right: 60, fontSize: 24, color: '#ffffff', opacity: 0.5 }}>
          kidus.dev
        </div>
      </div>
    ),
    { ...size }
  );
}
