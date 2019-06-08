import { toPixelCanvas } from './toPixel';
let html2canvas = require('html2canvas');
let flag: boolean = false;
let button: HTMLElement = document.getElementById('button');
let container: HTMLElement = document.querySelector('.container');
function createCanvas (element: Node): void {
    html2canvas(element, {
        scale: 1,
    }).then((canvas) => {
        let canvasElementArray = toPixelCanvas(canvas);
        canvasElementArray.forEach((canvasElement, index) => {
            canvasElement.style.transition = `transform 1s ${ 2 * index / canvasElementArray.length}s, opacity 500ms ${ 2 * index / canvasElementArray.length }s, rotate 1s ${ 2 * index / canvasElementArray.length }s`;
            element.appendChild(canvasElement);
            (document.querySelector('#tigger') as any).style.opacity = '0';
        });
        setTimeout(() => {
            canvasElementArray.forEach((elementItem) => {
                let randomRad = 2 * Math.PI * (Math.random() - 0.5);
                elementItem.style.transform = `rotate(${ 15 * (Math.random() - 0.5) }deg) translate(${ 60 * Math.cos(randomRad)}px, ${ 30 * Math.sin(randomRad) }px) rotate(${ -15 * (Math.random() - 0.5) }deg)`;
                elementItem.style.opacity = '0';
            })
        })
    })
}
button.addEventListener('click', () => {
    if (flag) {
        return;
    }
    flag = true;
    createCanvas(container);
})