import { toPng, toSvg } from 'html-to-image'

function getDateStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function download(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

export async function exportAsPNG(elementId: string, filename?: string) {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Diagram element not found')

  const dataUrl = await toPng(el, {
    backgroundColor: '#0d1117',
    pixelRatio: 2,
  })
  download(dataUrl, filename || `supaviz-export-${getDateStr()}.png`)
}

export async function exportAsSVG(elementId: string, filename?: string) {
  const el = document.getElementById(elementId)
  if (!el) throw new Error('Diagram element not found')

  const dataUrl = await toSvg(el, {
    backgroundColor: '#0d1117',
  })
  download(dataUrl, filename || `supaviz-export-${getDateStr()}.svg`)
}
