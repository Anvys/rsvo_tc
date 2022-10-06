import React, {EventHandler, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {getPixel} from "./utils/utilFunc";

function App() {
    const [img, setImg] = useState<string | null>(null)
    const [contr, setContr] = useState(1)
    const image = new Image()
    const canvas = document.getElementById('canvas1234') as HTMLCanvasElement

    const reader = new FileReader();
    const onReaderLoad = (str: string) => {
        console.log('Reader loaded ', str.substring(0, 10))
        setImg(str)
        image.src = str
    }
    const sobel = (imgData: ImageData, w: number, h: number) => {
        // const kernelX = [
        //     [-1, 0, 1],
        //     [-2, 0, 2],
        //     [-1, 0, 1]
        // ];
        // const kernelY = [
        //     [-1, -2, -1],
        //     [0, 0, 0],
        //     [1, 2, 1]
        // ];
        // const kernelX = [
        //     [-1, 0, 1],
        //     [-1, 0, 1],
        //     [-1, 0, 1],
        // ]
        // const kernelY = [
        //     [-1, -1, -1],
        //     [0, 0, 0],
        //     [1, 1, 1],
        // ]
        const kernelX = [
            [-3, 0, 3],
            [-10, 0, 10],
            [-3, 0, 3],
        ]
        const kernelY = [
            [3, 10, 3],
            [0, 0, 0],
            [-3, -10, -3],
        ]
        let sobelData = [];
        let grayData = []

        let data = imgData.data;
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                const pixel = getPixel(i, j, data, w, h)
                const avg = (pixel[0] + pixel[1] + pixel[2]) / 3
                grayData.push(avg, avg, avg, 255)
            }
        }
        let grayImageData: Uint8ClampedArray = new Uint8ClampedArray(grayData)
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                let sumX = 0;
                let sumY = 0;
                kernelX.forEach((v, i1) => {
                    v.forEach((u, j1) => {
                        const pixel = getPixel(i - 1 + i1, j - 1 + j1, data, w, h) || [0,0,0, 255]
                        const g = (pixel[0] + pixel[1] + pixel[2]) / 3
                        // const g = getPixel(i - 1 + i1, j - 1 + j1, grayImageData, w, h)[0] || 0
                        sumX = sumX + u * g
                        sumY = sumY + kernelY[i1][j1] * g
                    })
                })
                const res = Math.sqrt(sumX * sumX + sumY * sumY)
                sobelData.push(res, res, res, 255)

            }
        }
        let sobelImageData = new Uint8ClampedArray(sobelData)
        return [sobelImageData, grayImageData]
    }
    //
    // for (y = 0; y < height; y++) {
    //     for (x = 0; x < width; x++) {
    //         var pixelX = (
    //             (kernelX[0][0] * pixelAt(x - 1, y - 1)) +
    //             (kernelX[0][1] * pixelAt(x, y - 1)) +
    //             (kernelX[0][2] * pixelAt(x + 1, y - 1)) +
    //             (kernelX[1][0] * pixelAt(x - 1, y)) +
    //             (kernelX[1][1] * pixelAt(x, y)) +
    //             (kernelX[1][2] * pixelAt(x + 1, y)) +
    //             (kernelX[2][0] * pixelAt(x - 1, y + 1)) +
    //             (kernelX[2][1] * pixelAt(x, y + 1)) +
    //             (kernelX[2][2] * pixelAt(x + 1, y + 1))
    //         );
    //
    //         var pixelY = (
    //             (kernelY[0][0] * pixelAt(x - 1, y - 1)) +
    //             (kernelY[0][1] * pixelAt(x, y - 1)) +
    //             (kernelY[0][2] * pixelAt(x + 1, y - 1)) +
    //             (kernelY[1][0] * pixelAt(x - 1, y)) +
    //             (kernelY[1][1] * pixelAt(x, y)) +
    //             (kernelY[1][2] * pixelAt(x + 1, y)) +
    //             (kernelY[2][0] * pixelAt(x - 1, y + 1)) +
    //             (kernelY[2][1] * pixelAt(x, y + 1)) +
    //             (kernelY[2][2] * pixelAt(x + 1, y + 1))
    //         );
    //
    //         var magnitude = Math.sqrt((pixelX * pixelX) + (pixelY * pixelY)) >>> 0;
    //
    //         sobelData.push(magnitude, magnitude, magnitude, 255);
    //     }
    useEffect(() => {
        // console.log('img load: ', !!img)
        if (!!img) {
            image.src = img
            // console.log('image ', image.width)
            // const can = HTMLCanvasElement
            const ctx = canvas.getContext('2d')
            const w = image.width;
            const h = image.height;
            // console.log(w,h)
            canvas.width = w
            canvas.height = h
            if (!!ctx && w && h) {
                ctx.drawImage(image, 0, 0);
                let imageData = ctx.getImageData(0, 0, w, h)
                // let asd = ctx.createImageData(w, h,{colorSpace: 'srgb'}as ImageDataSettings)
                // let data = imageData.data as unknown as Array<number>
                // console.log('data',data)
                // @ts-ignore
                // data = imageData.data.map((v:number,i:number)=>i%4===0 ? v: v*0.1)


                const newData = imageData.data.map((v: number, i: number) => i % 4 === 0 ? v : v * contr)

                const data1 = new Uint8ClampedArray(newData);
                const imageData1 = new ImageData(data1, w, h);

                // console.log('imageDataBefore',imageData, newData)
                ctx.putImageData(imageData1, 0, 0)
                // console.log('imageDataAfter',imageData)
                // imageData.data =
                // console.log()

                const [sobelData, gray] = sobel(imageData1,w,h)
                console.log(sobelData.length)
                const imageDataSobel = new ImageData(sobelData, w, h);
                ctx.putImageData(imageDataSobel, 0, 0)
            }

        }
    }, [img, reader.result, image.width, contr])
    // useEffect(()=>{
    //     console.log('Image Str')
    // }, [image.src])
    const handleLoadFromPC: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files !== null && e.target.files[0] !== null) {
            const im = e.target.files[0]


            reader.addEventListener('load', () => onReaderLoad(reader.result as string));
            reader.readAsDataURL(e.target.files[0]);
            // console.log(e.target.files[0])
            // image = onReaderLoad(e.target.files[0] as string)
        }
    }
    // @ts-ignore
    // const clearLoaded:React.MouseEventHandler<HTMLInputElement> = e => e.target.value=undefined;
    return (
        <div className="App">
            <header className="App-header">
                <img style={{width: '250px', height: '150px'}} src={img === null ? undefined : img}>

                </img>
                <canvas id={'canvas1234'}/>
                {!!img &&
                    <input type={'range'} min={0.1} max={2} onChange={e => setContr(+e.target.value)} step={0.1}
                           value={contr}/>}
                <input type={'file'}
                       accept={'image/jpeg, image/jpg,image/svg,'}
                    // onClick={clearLoaded}
                       onChange={handleLoadFromPC}/>
            </header>
        </div>
    );
}

export default App;
