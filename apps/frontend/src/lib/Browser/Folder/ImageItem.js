import ImageItemTemplate from './Templates/ImageItem.html';
import ImageCountStatsTemplate from './Templates/ImageCountStats.html';
import ThumbnailSizes from '../ThumbnailSizes/Images.js';

export default class ImageItem extends MODULECLASS {
    constructor(parent, options, silent) {
        super(parent, options);

        this.browser = this.parent.parent.parent;
        this.options = options;
        this.hash = this.options.hash;
        this.imageIndex = this.options.index;

        this.isLoading = false;
        this.imageDataUrl = `${this.app.urlImageBase}/${this.options.pathExtracted}`;
        this.thumbnails = [];
        this.thumbnailIndex = 0;

        this.numberCount = `${this.imageIndex + 1} / ${this.parent.data.length}`;
        this.leftCount = this.parent.data.length - this.imageIndex - 1;

        this.exposeThumbnails();
        this.target = this.toDOM(ImageItemTemplate({
            scope: {
                name: this.options.fileName,
                thumbnails: this.thumbnails
            }
        }));
        this.target.onclick = e => this.select(e);
        this.parent.target.append(this.target);
        this.imageElement = this.target.querySelector('img');

        this.on('loadstart', e => {
            this.target.classList.add('loading');
            this.isLoading = true;
        });

        this.on('loadend', () => {
            this.target.classList.add('loaded');
            this.target.classList.remove('loading');
            this.isLoading = false;
            this.parent.concurrentImageRequests--;
            this.parent.canLoadNext() ? this.nextImage() : false;
        });

        this.on('loaderror', e => {
            console.log('>>> IMAGE LOAD ERROR', e);
            this.emit('loadend');
        });
    }

    select(e) {
        this.browser.setLocationHash(this.options.pathExtracted);
    }

    exposeThumbnails() {
        this.thumbnails = [];
        ThumbnailSizes.forEach(s => {
            this.thumbnails.push({
                url: encodeURI(`${this.app.urlMediaBase}/${s.name}/${this.options.pathExtracted}`),
                media: s.media
            });
        });
    }

    load() {
        this.drawCountStats();
        this.thumbnailIndex = this.thumbnails.length - 1 || 0;
        this.parent.concurrentImageRequests++;

        const req = new Request(this.thumbnails[this.thumbnailIndex].url);

        this.emit('loadstart');
        fetch(req)
            .then(response => response.blob())
            .then(imageBlob => {
                this.imageElement.src = URL.createObjectURL(imageBlob);
                this.emit('loadend');
            })
            .catch(e => this.emit('loaderror', e));
    }

    nextImage() {
        if (!this.parent.images)
            return false;

        if (this.imageIndex >= this.parent.data.length) {
            return false;
        }
        const nextImage = this.findNextImage(this.imageIndex);
        nextImage ? nextImage.load() : null;
    }

    findOwnIndex() {
        this.imageIndex = this.parent.findItemIndexByHash(this.hash);
    }

    findNextImage(index) {
        const nextIndex = index + 1;
        if (nextIndex >= this.parent.images.length)
            return false;

        const nextImage = this.parent.images[nextIndex];

        if (nextImage.isLoading)
            return this.findNextImage(nextIndex + 1);

        return nextImage;
    }

    drawCountStats() {
        if (!this.coutStatsElement) {
            this.coutStatsElement = toDOM(ImageCountStatsTemplate({
                scope: {
                    numberCount: this.numberCount,
                    leftCount: this.leftCount,
                }
            }));
            this.target.prepend(this.coutStatsElement);
        }
    }
}
