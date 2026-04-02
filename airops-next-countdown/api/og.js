import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

const LAUNCH = new Date('2026-05-13T14:00:00.000Z')
function pad(n) { return String(Math.floor(n)).padStart(2, '0') }

export default async function handler(request) {
  try {
    const origin = new URL(request.url).origin

    let fontData = null
    let fontName = 'serif'
    try {
      const fontRes = await fetch(`${origin}/fonts/SerrifVF.ttf`)
      if (fontRes.ok) {
        fontData = await fontRes.arrayBuffer()
        fontName = 'Serrif'
      }
    } catch (fontErr) {
      // font fetch failed, fall back to system serif
    }

    const now  = new Date()
    const dist = Math.max(0, LAUNCH.getTime() - now.getTime())
    const days    = pad(dist / (1000 * 60 * 60 * 24))
    const hours   = pad((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = pad((dist % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = pad((dist % (1000 * 60)) / 1000)

    const fonts = fontData
      ? [{ name: 'Serrif', data: fontData, weight: 400, style: 'normal' }]
      : []

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
                style: { fontSize: 180, fontWeight: 400, color: '#002910', fontFamily: fontName, lineHeight: 1, letterSpacing: '-0.03em' },
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
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
                      children: [
                        { type: 'div', props: { style: { fontSize: 80, fontWeight: 400, color: '#002910', fontFamily: fontName, lineHeight: 1 }, children: days } },
                        { type: 'div', props: { style: { fontSize: 11, color: '#008c44', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }, children: 'Days' } },
                      ],
                    },
                  },
                  { type: 'div', props: { style: { fontSize: 60, color: 'rgba(0,41,16,0.2)', fontFamily: fontName, paddingBottom: 16 }, children: ':' } },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
                      children: [
                        { type: 'div', props: { style: { fontSize: 80, fontWeight: 400, color: '#002910', fontFamily: fontName, lineHeight: 1 }, children: hours } },
                        { type: 'div', props: { style: { fontSize: 11, color: '#008c44', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }, children: 'Hours' } },
                      ],
                    },
                  },
                  { type: 'div', props: { style: { fontSize: 60, color: 'rgba(0,41,16,0.2)', fontFamily: fontName, paddingBottom: 16 }, children: ':' } },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
                      children: [
                        { type: 'div', props: { style: { fontSize: 80, fontWeight: 400, color: '#002910', fontFamily: fontName, lineHeight: 1 }, children: minutes } },
                        { type: 'div', props: { style: { fontSize: 11, color: '#008c44', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }, children: 'Minutes' } },
                      ],
                    },
                  },
                  { type: 'div', props: { style: { fontSize: 60, color: 'rgba(0,41,16,0.2)', fontFamily: fontName, paddingBottom: 16 }, children: ':' } },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
                      children: [
                        { type: 'div', props: { style: { fontSize: 80, fontWeight: 400, color: '#002910', fontFamily: fontName, lineHeight: 1 }, children: seconds } },
                        { type: 'div', props: { style: { fontSize: 11, color: '#008c44', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }, children: 'Seconds' } },
                      ],
                    },
                  },
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
        fonts,
        headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' },
      }
    )
  } catch (err) {
    return new Response(`OG error: ${err.message}`, { status: 500, headers: { 'Content-Type': 'text/plain' } })
  }
}
