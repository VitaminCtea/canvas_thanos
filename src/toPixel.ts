function toPixelCanvas (canvas): Array<HTMLCanvasElement> {
    const CANVAS_COUNT: number = 32;
    const RGBA_COUNT: number = 4;
    const REPEAT_RENDERING = 4;
    let { width, height } = canvas;
    let createImageDataArray: Array<any> = [];
    let context: CanvasRenderingContext2D = canvas.getContext('2d');
    let originalImageData: ImageData = context.getImageData(0, 0, width, height);
    for (let i: number = 0; i < CANVAS_COUNT; i++) {
        createImageDataArray[i] = context.createImageData(width, height);
    }
    for (let x: number = 0; x < width; ++x) {
        for (let y: number = 0; y < height; ++y) {
            for (let j: number = 0; j < REPEAT_RENDERING; j++) {
                let randomIndex = Math.floor(CANVAS_COUNT * (Math.random() + 2 * x / width) / 3);
                let pixelIndex = (y * width + x) * 4;
                for (let rgbaIndex: number = 0; rgbaIndex < RGBA_COUNT; rgbaIndex++) {
                    createImageDataArray[randomIndex].data[pixelIndex + rgbaIndex] = originalImageData.data[pixelIndex + rgbaIndex]
                }
            }
        }
    }
    return createImageDataArray.map((imageData) => {
        let canvasClone = canvas.cloneNode(true);
        canvasClone.getContext('2d').putImageData(imageData, 0, 0);
        canvasClone.style.position = 'absolute';
        canvasClone.style.top = '0';
        canvasClone.style.left = '0';
        canvasClone.style.width = '100%';
        canvasClone.style.height = '100%';
        return canvasClone;
    })
}
export {
    toPixelCanvas
}