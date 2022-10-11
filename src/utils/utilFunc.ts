export const getPixel = (x: number, y: number, arr: Uint8ClampedArray, w: number, h: number,) => {
    const index = ((y) * w + x) * 4
    return [arr[index], arr[index + 1], arr[index + 2], arr[index + 3]]
}
export const getPixelIndex = (x: number, y: number, arr: Uint8ClampedArray, w: number, h: number,): number => {
    return x < 0 || y < 0 ? -1 : ((y) * w + x) * 4
}
export const getGrayDataFromColor = (data: Uint8ClampedArray, w: number, h: number) => {
    const grayData = []
    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            const pixelIndex = getPixelIndex(i, j, data, w, h)
            const avg = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3
            grayData.push(avg, avg, avg, 255)
        }
    }
    return new Uint8ClampedArray(grayData)
}
