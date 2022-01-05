import ItemTemplate from './Templates/Item.html';
import ThumbnailSizes from '../ThumbnailSizes/Detail.js';
import Lens from './Lens.js';

export default class ImageViewerItem extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.options = options;

        this.imageDataUrl = `${this.parent.urlImageBase}/${this.options.pathExtracted}`;
        this.exposeThumbnails();
        this.draw();
    }

    draw() {
        this.target = this.toDOM(ItemTemplate({
            scope: {
                name: this.options.fileName,
                thumbnails: this.thumbnails
            }
        }));
        this.parent.target.prepend(this.target);

        this.imageElement = this.target.querySelector('img');
        this.target.classList.add('loading');
        this.imageElement.onload = (e) => {
            this.target.classList.remove('loading');
            this.target.classList.add('loaded');
        };

        this.imageElement.onerror = () => {

        };

        this.lens = new Lens(this);
    }

    exposeThumbnails() {
        this.thumbnails = [];
        ThumbnailSizes.forEach(s => {
            this.thumbnails.push({
                name: s.name,
                url: encodeURI(`${this.parent.urlMediaBase}/${s.name}/${this.options.pathExtracted}`),
                media: s.media
            });
        });
    }

    remove() {
        this.target ? this.target.remove() : null;
    }

    forget() {
        this.target.classList.add('previous');
    }
}
