export default class Route extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.router = EXPRESS.Router();
    }

    nicePath(path) {
        return decodeURI(path).replace(/^\//, '').replace(/\/$/, '');
    }

    extractPath(path, subtract) {
        return this.nicePath(path).replace(new RegExp(`${subtract}`, ''), '').split('/');
    }

    extractFilePath(requestPath) {
        this.nice = this.nicePath(requestPath);
        this.extractedPath = this.extractPath(this.nice, 'media/');
        this.thumbnailSize = this.extractedPath[0]; // bullshit. size means the filesize, not thumbnailsize
        this.fileName = this.extractedPath[this.extractedPath.length - 1];
        this.extractedPath = this.extractedPath.filter((p, i) => i > 0).filter((p, i) => i < this.extractedPath.length - 2).join('/');
        this.folder = `${STORE_ROOT_PATH}/${this.extractedPath}`;
        this.filePath = `${this.folder}/${this.fileName}`;
    }
}
