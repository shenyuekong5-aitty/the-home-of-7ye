/**
 * 图片等比缩放计算函数
 * @param {number} originalWidth 原图宽度
 * @param {number} originalHeight 原图高度
 * @param {number} maxWidth 目标最大宽度
 * @param {number} maxHeight 目标最大高度
 * @returns {object} 缩放后的宽高 { width, height }
 */
export function calculateImageSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  // 如果原图尺寸小于目标尺寸，直接返回原图尺寸（避免放大模糊）
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight }
  }

  // 计算宽高缩放比例
  const widthRatio = maxWidth / originalWidth
  const heightRatio = maxHeight / originalHeight
  // 取较小的比例，保证图片完全在目标尺寸内
  const scaleRatio = Math.min(widthRatio, heightRatio)

  // 返回等比缩放后的尺寸（取整，避免小数像素）
  return {
    width: Math.floor(originalWidth * scaleRatio),
    height: Math.floor(originalHeight * scaleRatio)
  }
}
