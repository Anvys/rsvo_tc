import React, {useEffect, useState} from 'react'
import s from '../../App.module.css'

type TProps = {
    onImgChange: (str: string) => void
}
export const FileLoader:React.FC<TProps> = (props) => {
    const { onImgChange} = props
    const [img, setImg] = useState<string | null>(null)
    const reader = new FileReader();
    const handleLoadFromPC: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files !== null && e.target.files[0] !== null) {
            const im = e.target.files[0]
            console.log(`Loaded omg `, im)
            reader.addEventListener('load', () => {
                // console.log(`Read result`, reader.result)
                setImg(reader.result as string)
                onImgChange(reader.result as string)
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    const resetUpload = () =>{
        const fl = document.querySelector('#fileLoader5623f34f') as HTMLInputElement
        fl.value=''
        setImg(null)
    }
    useEffect(()=>{
        if(img!== null)onImgChange(img)
    },[img])
    return (
        <div className={s.fileLoader}>
            {img && <img className={s.imgPrev} alt={'Loaded img prev'}src={img === null ? undefined : img}/>}
            <input type={'file'}
                   id={'fileLoader5623f34f'}
                   accept={'image/jpeg, image/jpg,image/svg,'}
                onClick={(e)=>resetUpload()}

                   onChange={handleLoadFromPC}/>
            <div className={s.btnControl}>
                {/*<button className={s.btn} type={'button'} onClick={()=>getLoadedImg(img)}>Reset changes</button>*/}
                {/*<button className={s.btn} type={'button'} onClick={resetUpload}>Reset upload</button>*/}
            </div>

        </div>
    )
}