import { ImageResponse } from 'next/server';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050d1a 0%, #0c2747 100%)',
        }}
      >
        <svg width="360" height="360" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#bae6fd" strokeWidth="5" strokeLinecap="round" fill="none">
            <line x1="50" y1="8" x2="50" y2="92" />
            <line x1="50" y1="16" x2="42" y2="24" />
            <line x1="50" y1="16" x2="58" y2="24" />
            <line x1="50" y1="84" x2="42" y2="76" />
            <line x1="50" y1="84" x2="58" y2="76" />
            <line x1="13" y1="29" x2="87" y2="71" />
            <line x1="22" y1="27" x2="24" y2="37" />
            <line x1="22" y1="27" x2="32" y2="25" />
            <line x1="78" y1="73" x2="76" y2="63" />
            <line x1="78" y1="73" x2="68" y2="75" />
            <line x1="87" y1="29" x2="13" y2="71" />
            <line x1="78" y1="27" x2="76" y2="37" />
            <line x1="78" y1="27" x2="68" y2="25" />
            <line x1="22" y1="73" x2="24" y2="63" />
            <line x1="22" y1="73" x2="32" y2="75" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
