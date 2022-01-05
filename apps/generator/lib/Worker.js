import ImageMagick from 'imagemagick-stream';
import fs from 'fs-extra';

export default class Worker extends MODULECLASS {
    constructor(parent, data) {
        super(parent);

        this.label = 'GENERATOR WORKER';
        this.file = data.file;
        this.hash = this.file.hash;

        this.filePath = this.file.filePath;
        this.thumbnailPath = this.file.thumbnailPath;
        this.thumbnail = this.file.thumbnails.filter(thumb => thumb.name === GENERATOR_THUMBNAIL_SIZE_KEY)[0].path;
        this.quality = this.file.thumbnails.filter(thumb => thumb.name === GENERATOR_THUMBNAIL_SIZE_KEY)[0].quality;
        this.size = this.file.thumbnails.filter(thumb => thumb.name === GENERATOR_THUMBNAIL_SIZE_KEY)[0].size;
        this.imagemagickSizeString = `${this.size}x${this.size}`;

        this.generateThumbnail();
    }

    generateThumbnail() {
        LOG(this.label, 'RUNNING IMAGEMAGICK', this.hash, 'FROM', this.filePath, 'IM', this.imagemagickSizeString);

        fs.mkdirpSync(this.thumbnailPath);

        const read = fs.createReadStream(this.filePath);
        const write = fs.createWriteStream(this.thumbnail);

        write.on('finish', () => this.emit('complete', this));

        const resize = ImageMagick().resize(this.imagemagickSizeString).quality(this.quality);
        read.pipe(resize).pipe(write);

        /*setTimeout(() => {
            this.emit('complete', this);
        }, 100);*/
    }
}
