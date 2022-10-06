import React, {useEffect, useState} from 'react';
import s from './App.module.css'
import {getGrayDataFromColor, getImageDataContrast, getImageDataGradient} from "./utils/utilFunc";
import {FileLoader} from "./components/FileLoader";

export const selOpt = {
    filterOptions: ['Contrast', 'Gradient'] as const,
    contrastOptions: ['Grayscale', 'Color'] as const,
    gradientOptions: ['Sobel', 'Prewitt', 'Sharr'] as const,
}
export type TGradientFilters = typeof selOpt.gradientOptions[number]
export type TContrastFilters = typeof selOpt.contrastOptions[number]
export type TFilters = typeof selOpt.filterOptions[number]

function App() {
    const [img, setImg] = useState<string | null>(null)
    const [contr, setContr] = useState(1)
    const [filter, setFilter] = useState<TFilters>("Contrast")
    const [cFilter, setCFilter] = useState<TContrastFilters>('Color')
    const [gFilter, setGFilter] = useState<TGradientFilters>("Prewitt")
    const [image, setImage] = useState(new Image())

    const [imgDataArr, setImgDataArr] = useState(new Uint8ClampedArray([]))
    const [imgDataArrGray, setImgDataArrGray] = useState(new Uint8ClampedArray([]))
    // const image = new Image()
    const canvas = document.getElementById('canvas1234') as HTMLCanvasElement


    const onReaderLoad = (str: string | null) => {
        console.log('Reader loaded ', str?.substring(0, 10), str === img)
        setImg(str)
        setImage(new Image())

        image.src = str || ''
    }
    const getLoaded = (str: string | null) => {
        console.log('Reset loaded ', str?.substring(0, 10) || 'null')
        setImg(str)
        if (str !== null) image.src = str
    }

    useEffect(() => {
        console.log('effect1', img===image.src)
        if (!!img) {
            const ctx = canvas.getContext('2d')
            image.src = img
            const w = image.width;
            const h = image.height;
            canvas.width = w
            canvas.height = h
            console.log('ctx', !!ctx, w, h)
            if (!!ctx && w && h) {
                ctx.drawImage(image, 0, 0);
                let data = ctx.getImageData(0, 0, w, h).data
                console.log('rehere')
                setImgDataArr(data)
                setImgDataArrGray(getGrayDataFromColor(data,w,h))
            }
        }
    }, [img])
    useEffect(()=>{
        console.log('WIDTH: ',image.width)
    }, [image.width])
    useEffect(() => {
        if (!!canvas) {
            const ctx = canvas.getContext('2d')
            if (ctx !== null) {
                const w = canvas.width
                const h = canvas.height
                switch (filter) {
                    case "Contrast":
                        const contrastImageData = getImageDataContrast(imgDataArr, contr, cFilter, w, h)
                        ctx.putImageData(contrastImageData, 0, 0)
                        break
                    case "Gradient":
                        const gradientImageData = getImageDataGradient(imgDataArrGray, gFilter, w, h)
                        ctx.putImageData(gradientImageData, 0, 0)
                        break
                    default:
                        console.log('Invalid filter type')
                }
            }
        }
    }, [contr, filter, cFilter, gFilter])
    return (
        <div className={s.App}>
            <header className="App-header">
                RSVO TEST CASE
            </header>
            <div className={s.content}>
                <canvas id={'canvas1234'} className={s.imgResult}/>
                <div className={s.optionDiv}>
                    {!img && <FileLoader onImgChange={onReaderLoad} getLoadedImg={getLoaded}/>}
                    {img && <div>
                        <select value={filter} onChange={e => setFilter(e.target.value as TFilters)}>
                            {selOpt.filterOptions.map((v, i) => <option key={i} value={v}>{v}</option>)}
                        </select>
                        {filter === 'Contrast' && <div>
                            <select value={cFilter} onChange={e => setCFilter(e.target.value as TContrastFilters)}>
                                {selOpt.contrastOptions.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                            <div>
                                <p>Contrast</p>
                                <input type={'range'} min={0.1} max={2} onChange={e => setContr(+e.target.value)} step={0.1}
                                       value={contr}/>
                            </div>

                        </div>}
                        {filter === 'Gradient' && <div>
                            <select value={gFilter} onChange={e => setGFilter(e.target.value as TGradientFilters)}>
                                {selOpt.gradientOptions.map((v, i) => <option key={i} value={v}>{v}</option>)}
                            </select>
                        </div>}
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default App;
