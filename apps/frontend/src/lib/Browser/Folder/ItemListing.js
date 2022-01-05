import ImageItem from "./ImageItem.js";
import ItemListingOptions from './ItemListingOptions.js';

export default class ItemListing extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);
        this.label = 'ITEM LISTING';
        this.options = options;
        this.folder = this.parent;
        this.images = [];

        this.maxConcurrentImageRequests = this.folder.maxConcurrentImageRequests;
        this.concurrentImageRequests = this.folder.concurrentImageRequests;

        this.target = this.folder.target.querySelector('[data-files]');
        this.optionsElement = new ItemListingOptions(this);

        this.set();
    }

    set(childs) {
        this.remove();

        if (childs) {
            this.data = childs.filter(c => c.type === 'image');
        } else {
            this.data = this.folder.data.data.childs.filter(c => c.type === 'image');
        }

        this.order();

        this.images = [];
        if (this.data.length > 0) {
            this.data.forEach((fileData, index) => {
                fileData.index = index;
                const imageItem = new ImageItem(this, fileData);
                this.images.push(imageItem);
            });

            // start loading chain with the first image
            // if the load is complete, the next image will be loaded...
            // first image to load

            this.images[0].load();
        }
    }

    order(byKey, direction) {
        !byKey ? byKey = 'mtime' : null;
        !direction ? direction = 'DESC' : null;
        this.data = ksortObjArray(this.data, byKey);
        direction === 'DESC' ? this.data.reverse() : null;
    }

    remove() {
        this.data ? delete this.data : null;
        this.images ? this.images.forEach(i => i.target.remove()) : null;
        this.images ? delete this.images : null;
    }

    findItemIndexByHash(hash) {
        return this.images.findIndex(i => i.hash === hash);
    }

    canLoadNext() {
        this.concurrentImageRequests < 0 ? this.concurrentImageRequests = 0 : false;
        return this.concurrentImageRequests < this.maxConcurrentImageRequests;
    }
}
