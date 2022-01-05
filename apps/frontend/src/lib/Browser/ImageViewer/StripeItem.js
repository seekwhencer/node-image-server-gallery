import StripeItemTemplate from './Templates/StripeItem.html';
import ThumbnailSizes from '../ThumbnailSizes/Images.js';

export default class StripeItem extends MODULECLASS {
    constructor(parent, options, silent) {
        super(parent, options);
        this.options = options;

        this.imageDataUrl = `${this.parent.urlImageBase}/${this.options.pathExtracted}`;
        this.exposeThumbnails();
        this.target = this.toDOM(StripeItemTemplate({
            scope: {
                name: this.options.fileName,
                thumbnails: this.thumbnails
            }
        }));
        this.target.onclick = e => this.select(e);
        this.parent.target.append(this.target);
        this.imageElement = this.target.querySelector('img');

        this.imageElement.onloadstart = e => {
            this.target.classList.add('loading');
        };

        this.imageElement.onload = e => {
            this.nextImage();
            this.target.classList.remove('loading');
            this.target.classList.add('loaded');
        }

        this.imageElement.onerror = e => {
            this.nextImage();
            this.target.classList.remove('loading');
            this.target.classList.add('failed');
        }
    }

    select(e) {
        this.parent.parent.parent.setLocationHash(this.options.pathExtracted);
    }


    exposeThumbnails() {
        this.thumbnails = [];
        ThumbnailSizes.forEach(s => {
            this.thumbnails.push({
                url: encodeURI(`${this.parent.urlMediaBase}/${s.name}/${this.options.pathExtracted}`),
                media: s.media
            });
        });
    }

    load() {
        this.findIndex();
        this.thumbnailIndex = this.thumbnails.length - 1 || 0;
        this.imageElement.src = this.thumbnails[this.thumbnailIndex].url;
    }

    nextImage() {
        if (this.imageIndex >= this.parent.images.length)
            return false;

        const nextImage = this.findNextImage();
        nextImage ? nextImage.load() : null;
    }

    findIndex() {
        this.imageIndex = this.parent.images.findIndex(i => i.options.hash === this.options.hash);
    }

    findNextImage() {
        if (this.imageIndex + 1 >= this.parent.images.length)
            return false;

        const nextImage = this.parent.images[this.imageIndex + 1];
        if (nextImage) {
            return nextImage;
        } else {
            this.imageIndex++;
            return this.findNextImage();
        }
    }

}
