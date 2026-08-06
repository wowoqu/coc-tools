import { domToBlob } from 'modern-screenshot'

const waitForImage = async (image: HTMLImageElement) => {
  if (!image.complete) {
    await new Promise<void>((resolve, reject) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => reject(new Error('load failed')), { once: true })
    }).catch(() => {
      throw new Error(`图片加载失败：${image.alt || image.src}`)
    })
  }

  try {
    await image.decode()
  } catch {
    // 部分 WebKit 版本会在图片已经正常显示时拒绝 decode()，以实际尺寸为准。
  }

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error(`图片加载失败：${image.alt || image.src}`)
  }
}

const imageToPngDataUrl = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  // clientWidth / clientHeight 不受移动端预览层 transform 缩放影响。
  const renderedWidth = Math.max(1, Math.ceil(image.clientWidth * 2))
  const renderedHeight = Math.max(1, Math.ceil(image.clientHeight * 2))
  const scale = Math.min(
    1,
    renderedWidth / image.naturalWidth,
    renderedHeight / image.naturalHeight,
  )

  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))

  if (!context) throw new Error('浏览器无法处理卡片图片')

  try {
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/png')
    if (dataUrl === 'data:,') throw new Error('empty canvas')
    return dataUrl
  } catch {
    throw new Error(`图片转换失败：${image.alt || image.src}`)
  }
}

const prepareImagesForWebKitExport = async (images: HTMLImageElement[]) => {
  await Promise.all(images.map(waitForImage))
  const pngSources = images.map(imageToPngDataUrl)

  images.forEach((image, index) => {
    image.src = pngSources[index]
    image.loading = 'eager'
  })

  await Promise.all(images.map(waitForImage))
}

const safeFilePart = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[<>:"/\\|?*]/g, '')
    .slice(0, 24)

export const exportPoster = async (node: HTMLElement, playerName: string) => {
  await document.fonts.ready
  const images = Array.from(node.querySelectorAll('img'))
  const originalSources = images.map((image) => image.getAttribute('src') ?? '')
  let blob: Blob | null

  try {
    // Safari / 微信 WebView 在 SVG foreignObject 中经常漏绘 WebP。
    // 先转为和最终海报尺寸匹配的 PNG Data URL，可避免该 WebKit 兼容问题。
    await prepareImagesForWebKitExport(images)
    blob = await domToBlob(node, {
      width: 540,
      height: 675,
      scale: 2,
      backgroundColor: '#091323',
      drawImageInterval: 100,
      features: {
        fixSvgXmlDecode: true,
      },
      fetch: {
        bypassingCache: true,
      },
    })
  } finally {
    images.forEach((image, index) => {
      image.src = originalSources[index]
    })
  }

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
