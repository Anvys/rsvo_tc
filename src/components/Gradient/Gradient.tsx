import React, {useEffect, useState} from 'react'
import {TFilter} from "../../App";
import {getPixelIndex} from "../../utils/utilFunc";
//import styles from './Gradient.module.css'

const gradientFilterOptions = ['Sobel', 'Prewitt', 'Sharr'] as const
export type TGradientFilter = typeof gradientFilterOptions[number]

type TProps = {
    onFilterChange: (filter: TFilter) => void
}
export const Gradient: React.FC<TProps> = (props) => {
    const [filter, setFilter] = useState<TGradientFilter>('Sharr')
    useEffect(() => {
        props.onFilterChange({
            type: 'Gradient',
            option: {
                filter
            }
        })
    },[filter])
    return (
        <div>
            <select value={filter} onChange={e => setFilter(e.target.value as TGradientFilter)}>
                {gradientFilterOptions.map((v, i) => <option key={i} value={v}>{v}</option>)}
            </select>
        </div>
    )
}


export const getImageDataGradient = (old: Uint8ClampedArray, gFilter: TGradientFilter, w: number, h: number) => {
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
                    const pixelIndex = getPixelIndex(i - 1 + i1, j - 1 + j1, data, w, h)// || [0, 0, 0, 255]
                    const g = pixelIndex === -1 ? 0 : (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3
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
const getKernelFilters = (filter: TGradientFilter) => {
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