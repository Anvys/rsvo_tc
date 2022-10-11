import React, {useState} from 'react';
import s from './App.module.css'
import {FileLoader} from "./components/FileLoader/FileLoader";
import {Contrast, TContrastFilter} from "./components/Contrast/Contrast";
import {Gradient, TGradientFilter} from "./components/Gradient/Gradient";
import {TargetImage} from "./components/TargetImage/TargetImage";


const filterTypes = ['Contrast', 'Gradient'] as const
export type TFilterType = ['Contrast', 'Gradient'][number]

export type TContrastOption = {
    color: TContrastFilter
    contrast: number
}
export type TGradientOption = {
    filter: TGradientFilter
}
export type TFilter = {
    type: TFilterType
    option: TContrastOption | TGradientOption
}
export const  App:React.FC = () => {
    const [img, setImg] = useState<string | null>(null)
    const [filterType, setFilterType] = useState<TFilterType>("Contrast")
    const [filter, setFilter] = useState<TFilter>(()=>({type: "Contrast", option:{color:"Color", contrast: 1}}))
    const [image, setImage] = useState(new Image())
    const [isImgLoaded, setIsImgLoaded] = useState(false)

    const onFilterChange = (filter:TFilter) => {
        setFilter(filter)
    }
    const onReaderLoad = (str: string | null) => {
        setIsImgLoaded(false)
        // console.log('Reader loaded ', str?.substring(0, 10), str === img)
        setImage(actual=>{
            actual.src = str || ''
            return actual
        })
        image.onload = ()=> {
            setIsImgLoaded(true)
            setImg(str)
        }
    }
    return (
        <div className={s.App}>
            <header className="App-header">
                RSVO TEST CASE
            </header>
            <div className={s.content}>
                {isImgLoaded ? <TargetImage image={image} filter={filter}/> :<div className={s.imgResult}/>}
                <div className={s.optionDiv}>
                    {!img && <FileLoader onImgChange={onReaderLoad}/>}
                    {img && isImgLoaded && <div>
                        <select value={filterType} onChange={e => setFilterType(e.target.value as TFilterType)}>
                            {filterTypes.map((v, i) => <option key={i} value={v}>{v}</option>)}
                        </select>
                        {filterType === 'Contrast' && <Contrast onFilterChange={onFilterChange}/>}
                        {filterType === 'Gradient' && <Gradient onFilterChange={onFilterChange}/>}
                    </div>}
                </div>
            </div>
        </div>
    );
}
