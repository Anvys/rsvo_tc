import React, {useEffect, useRef} from 'react'
import s from "../../App.module.css";
import {TContrastOption, TFilter, TGradientOption} from "../../App";
import {getGrayDataFromColor} from "../../utils/utilFunc";
import {getImageDataGradient} from "../Gradient/Gradient";
import {getImageDataContrast} from "../Contrast/Contrast";
//import styles from './TargetImage.module.css'

type TProps = {
    image: HTMLImageElement
    filter: TFilter
}
export const TargetImage:React.FC<TProps> = (props) => {
    const {filter, image} = props
    const ref = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = ref.current
        if (canvas) {
            const ctx = ref.current.getContext('2d')
            if(ctx!==null && image.width && image.height){
                const w = image.width;
                const h = image.height;
                canvas.width = w
                canvas.height = h
                ctx.drawImage(image,0,0)
                let data = ctx.getImageData(0, 0, w, h).data
                switch (filter.type){
                    case "Contrast":
                        const contrastFilter = filter.option as TContrastOption
                        const contrastImageData = getImageDataContrast(data, contrastFilter.contrast, contrastFilter.color, w, h)
                        ctx.putImageData(contrastImageData, 0, 0)
                        break
                    case "Gradient":
                        const gradientFilter = filter.option as TGradientOption
                        const imgDataArrGray = getGrayDataFromColor(data, w, h)
                        const gradientImageData = getImageDataGradient(imgDataArrGray, gradientFilter.filter, w, h)
                        ctx.putImageData(gradientImageData, 0, 0)
                        break
                }
            }
        }
    }, [image, filter])
    return (
        <>
            <canvas ref={ref} id={'canvas1234'} className={s.imgResult}/>
        </>
    )
}