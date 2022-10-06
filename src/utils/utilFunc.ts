import {TContrastFilters, TGradientFilters} from "../App";

export const getPixel = (x: number, y: number, arr: Uint8ClampedArray, w: number, h: number,) => {
    const index = ((y) * w + x) * 4
    return [arr[index], arr[index + 1], arr[index + 2], arr[index + 3]]
}
export const getPixelIndex = (x: number, y: number, arr: Uint8ClampedArray, w: number, h: number,): number => {
    return x < 0 || y < 0 ? -1 : ((y) * w + x) * 4
}
const getDataWithContrast = (data: Uint8ClampedArray, contr: number) => data.map((v: number, i: number) => i % 4 === 0 ? v : v * contr)
export const getImageDataContrast = (old: Uint8ClampedArray, contr: number, cFilter: TContrastFilters, w: number, h: number) => {
    if (cFilter === 'Color') {
        const colorData = getDataWithContrast(old, contr)
        return new ImageData(new Uint8ClampedArray(colorData), w, h);
    } else {
        const grayData = getDataWithContrast(getGrayDataFromColor(old, w, h), contr)
        return new ImageData(new Uint8ClampedArray(grayData), w, h);
    }
}

export const getGrayDataFromColor = (data: Uint8ClampedArray, w: number, h: number) => {
    const grayData = []
    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            // const pixel = getPixel(i, j, data, w, h)
            const pixelIndex = getPixelIndex(i, j, data, w, h)
            // const avg = (pixel[0] + pixel[1] + pixel[2]) / 3
            const avg = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3
            grayData.push(avg, avg, avg, 255)
        }
    }
    return new Uint8ClampedArray(grayData)
}
const getKernelFilters = (filter: TGradientFilters) => {
    switch (filter) {
        case 'Sobel':
            return {
                x: [[-1, 0, 1],
                    [-2, 0, 2],
                    [-1, 0, 1]],
                y: [[-1, -2, -1],
                    [0, 0, 0],
                    [1, 2, 1]]
            }
        case 'Prewitt':
            return {
                x: [[-1, 0, 1],
                    [-1, 0, 1],
                    [-1, 0, 1]],
                y: [[-1, -1, -1],
                    [0, 0, 0],
                    [1, 1, 1]]
            }
        case 'Sharr':
            return {
                x: [[-3, 0, 3],
                    [-10, 0, 10],
                    [-3, 0, 3]],
                y: [[3, 10, 3],
                    [0, 0, 0],
                    [-3, -10, -3]]
            }

    }
}
export const getImageDataGradient = (old: Uint8ClampedArray, gFilter: TGradientFilters, w: number, h: number) => {
    // const data = getGrayDataFromColor(old.data, w,h)
    const data = old
    const kernel = getKernelFilters(gFilter)
    const sobelData = []
    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
            let sumX = 0;
            let sumY = 0;
            kernel.x.forEach((v, i1) => {
                v.forEach((u, j1) => {
                    // const pixel = getPixel(i - 1 + i1, j - 1 + j1, data, w, h) || [0, 0, 0, 255]
                    const pixelIndex = getPixelIndex(i - 1 + i1, j - 1 + j1, data, w, h)// || [0, 0, 0, 255]
                    const g = pixelIndex === -1 ? 0 : (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3
                    // const g = getPixel(i - 1 + i1, j - 1 + j1, grayImageData, w, h)[0] || 0
                    sumX = sumX + u * g
                    sumY = sumY + kernel.y[i1][j1] * g
                })
            })
            const res = Math.sqrt(sumX * sumX + sumY * sumY)
            sobelData.push(res, res, res, 255)
        }
    }
    return new ImageData(new Uint8ClampedArray(sobelData), w, h);
}