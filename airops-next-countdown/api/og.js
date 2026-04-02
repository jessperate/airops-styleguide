import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

const LAUNCH = new Date('2026-05-13T14:00:00.000Z')
function pad(n) { return String(Math.floor(n)).padStart(2, '0') }

function unit(value, label, fontName) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
      children: [
        { type: 'div', props: { style: { fontSize: 80, fontWeight: 400, color: '#002910', fontFamily: fontName, lineHeight: 1 }, children: value } },
        { type: 'div', props: { style: { fontSize: 11, color: '#008c44', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }, children: label } },
      ],
    },
  }
}

function sep(fontName) {
  return { type: 'div', props: { style: { fontSize: 60, color: 'rgba(0,41,16,0.2)', fontFamily: fontName, paddingBottom: 16 }, children: ':' } }
}

export default async function handler(request) {
  const origin = new URL(request.url).origin
  const fontData = await fetch(`${origin}/fonts/SerrifVF.ttf`).then(r => r.arrayBuffer())

  const now  = new Date()
  const dist = Math.max(0, LAUNCH.getTime() - now.getTime())
  const days    = pad(dist / (1000 * 60 * 60 * 24))
  const hours   = pad((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = pad((dist % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = pad((dist % (1000 * 60)) / 1000)

  const fn = 'Serrif'

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fffb',
          gap: 32,
        },
        children: [
          {
            type: 'div',
            props: {
              style: { fontSize: 180, fontWeight: 400, color: '#002910', fontFamily: fn, lineHeight: 1, letterSpacing: '-0.03em' },
              children: 'Next',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: 40,
                alignItems: 'center',
                backgroundColor: 'white',
                borderWidth: 1.5,
                borderStyle: 'solid',
                borderColor: '#002910',
                borderRadius: 999,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 52,
                paddingRight: 52,
              },
              children: [
                unit(days, 'Days', fn),
                sep(fn),
                unit(hours, 'Hours', fn),
                sep(fn),
                unit(minutes, 'Minutes', fn),
                sep(fn),
                unit(seconds, 'Seconds', fn),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { fontSize: 12, color: '#002910', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: 'monospace' },
              children: 'DISRUPTION REWARDS THE TEAMS THAT EMBRACE IT EARLY  ·  CONTROL YOUR NARRATIVE  ·  WIN AI SEARCH',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Serrif', data: fontData, weight: 400, style: 'normal' }],
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' },
    }
  )
}
