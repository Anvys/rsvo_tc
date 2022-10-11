import React, {useEffect, useState} from 'react'
import {TFilter} from "../../App";
import {getGrayDataFromColor} from "../../utils/utilFunc";
//import styles from './Contrast.module.css'

const contrastFilterOptions = ['Grayscale', 'Color'] as const
export type TContrastFilter = typeof contrastFilterOptions[number]

type TProps = {
    onFilterChange: (filter: TFilter) => void
}
export const Contrast: React.FC<TProps> = (props) => {
    const [filter, setFilter] = useState<TContrastFilter>('Color')
    const [contrast, setContrast] = useState(1)
    useEffect(() => {
        props.onFilterChange({
            type: 'Contrast',
            option: {
                color: filter, contrast
            }
        })
    }, [filter, contrast])
    return (
        <div>
            <select value={filter} onChange={e => setFilter(e.target.value as TContrastFilter)}>
                {contrastFilterOptions.map((v, i) => <option key={i} value={v}>{v}</option>)}
            </select>
            <div>
                <p>Contrast</p>
                <input type={'range'} min={0.1} max={2} onChange={e => setContrast(+e.target.value)} step={0.1}
                       value={contrast}/>
            </div>
        </div>
    )
}

const getDataWithContrast = (data: Uint8ClampedArray, contr: number) =>
    data.map((v: number, i: number) => i % 4 === 0 ? v : v * contr)
export const getImageDataContrast = (old: Uint8ClampedArray, contr: number, cFilter: TContrastFilter, w: number, h: number) => {
    if (cFilter === 'Color') {
        const colorData = getDataWithContrast(old, contr)
        return new ImageData(new Uint8ClampedArray(colorData), w, h);
    } else {
        const grayData = getDataWithContrast(getGrayDataFromColor(old, w, h), contr)
        return new ImageData(new Uint8ClampedArray(grayData), w, h);
    }
}
