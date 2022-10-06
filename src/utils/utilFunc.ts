import React from "react";
//
//
//
// const getSortTestArr = (fSort:(a:number, b: number)=>number) =>{
//     const arr = [5,2,6,3,46,1,6,4,3,6,8,2,46,8,3,7,9,2,32,5]
//     arr.sort((a,b,c)=>1)
//     console.log(arr)
// }

export const getPixel = (x:number, y:number, arr:Uint8ClampedArray, w:number,h:number,) =>{
    const index = ((y)*w+x)*4
    return [arr[index],arr[index+1],arr[index+2],arr[index+3]]
}