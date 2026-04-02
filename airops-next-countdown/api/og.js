import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

export default async function handler(request) {
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fffb',
        },
        children: 'AirOps Next',
      },
    },
    { width: 1200, height: 630 }
  )
}
