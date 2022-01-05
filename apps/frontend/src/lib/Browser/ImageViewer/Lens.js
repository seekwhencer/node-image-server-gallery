import LensTemplate from './Templates/Lens.html';

export default class Lens extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.target = this.toDOM(LensTemplate({
            scope: {}
        }));
        this.parent.target.prepend(this.target);

        this.imageOriginalUrl = this.parent.thumbnails.filter(i => i.name === 'original')[0].url;

        //
        this.img = this.parent.imageElement;


        /*this.lens = document.createElement("DIV");
        this.lens.setAttribute("class", "img-zoom-lens");
        this.parent.target.prepend(this.lens);
        this.cx = this.result.offsetWidth / this.lens.offsetWidth;
        this.cy = this.result.offsetHeight / this.lens.offsetHeight;
        this.result.style.backgroundImage = "url('" + this.imageOriginalUrl + "')";
        this.result.style.backgroundSize = (this.img.width * this.cx) + "px " + (this.img.height * this.cy) + "px";
        this.lens.addEventListener("mousemove", e => this.moveLens(e));
        this.img.addEventListener("mousemove", e => this.moveLens(e));
        this.lens.addEventListener("touchmove", e => this.moveLens(e));
        this.img.addEventListener("touchmove", e => this.moveLens(e));*/

    }
/*
    moveLens(e) {
        console.log('>>>', e);
        let pos, x, y;
        e.preventDefault();
        pos = this.getCursorPos(e);
        x = pos.x - (this.lens.offsetWidth / 2);
        y = pos.y - (this.lens.offsetHeight / 2);
        if (x > this.img.width - this.lens.offsetWidth) {
            x = this.img.width - this.lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > this.img.height - this.lens.offsetHeight) {
            y = this.img.height - this.lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }
        this.lens.style.left = x + "px";
        this.lens.style.top = y + "px";
        this.result.style.backgroundPosition = "-" + (x * this.cx) + "px -" + (y * this.cy) + "px";
    }

    getCursorPos(e) {
        let a, x = 0, y = 0;
        e = e || window.event;
        a = this.img.getBoundingClientRect();
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x: x, y: y};
    }*/
}
