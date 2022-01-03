class boolArray{
    constructor(length=1000){
        this.base=32;
        this.array=new Array(Math.ceil(length/this.base));
        for(let i=0; i<this.array.length; i++){
            this.array[i]=0;
        }
    }
    get(idx){
        let outerIdx=null;
        let innerIdx=null;
        [outerIdx, innerIdx]=this.convert(idx);
        const innerMask=1<<innerIdx;
        console.log("mask=",innerMask);
        return this.array[outerIdx]&&innerMask!=0;
    }
    set(idx, value=true){
        let outerIdx=null;
        let innerIdx=null;
        [outerIdx, innerIdx]=this.convert(idx);
        const innerMask=1<<innerIdx;
        // switch: mask takes value, !mask takes current value
        this.array[outerIdx]=((!innerMask)&&this.array[outerIdx])||(innerMask&&value);
    }
    convert(idx){
        const outerIdx=Math.floor(idx/this.base);
        const innerIdx=idx%this.base;
        return[outerIdx, innerIdx];
    }
} export default boolArray