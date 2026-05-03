declare module 'qrcode' {
  interface QRCodeToCanvasOptions {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
  }

  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<HTMLCanvasElement>
}
