import { toBlob } from 'html-to-image'

const waitForImages = async (node: HTMLElement) => {
  const images = Array.from(node.querySelectorAll('img'))
  await Promise.all(
    images.map(async (image) => {
      if (image.complete && image.naturalWidth > 0) return
      try {
        await image.decode()
      } catch {
        throw new Error(`图片加载失败：${image.alt || image.src}`)
      }
    }),
  )
}

const safeFilePart = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[<>:"/\\|?*]/g, '')
    .slice(0, 24)

export const exportPoster = async (node: HTMLElement, playerName: string) => {
  await document.fonts.ready
  await waitForImages(node)

  const blob = await toBlob(node, {
    width: 540,
    height: 675,
    canvasWidth: 1080,
    canvasHeight: 1350,
    pixelRatio: 1,
    cacheBust: true,
    backgroundColor: '#091323',
  })

  if (!blob) throw new Error('浏览器未能生成图片文件')

  const playerPart = safeFilePart(playerName)
  const fileName = playerPart ? `部落换卡-${playerPart}.png` : '部落换卡.png'
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.download = fileName
  link.href = objectUrl
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}
