import Route from '../Route.js';
import fs from 'fs-extra';

export default class MediaRoutes extends Route {
    constructor(parent, options) {
        super(parent, options);

        this.store = this.app.store;
        this.generator = this.app.generatorserver;

        this.router.get('/media', (req, res) => {
            const hash = req.params.hash;

            res.json({
                hash: hash
            });
        });

        this.router.get(/(.+\/)?media\/original\/(.+)/i, (req, res) => {
            this.extractFilePath(req.path);
            if (fs.existsSync(this.filePath)) {
                res.sendFile(this.filePath);
            } else {
                res.end();
            }
        });

        this.router.get(/(.+\/)?media\/(.+)/i, async (req, res, next) => {
            this.extractFilePath(req.path);

            return this.store
                .grab(this.filePath)
                .then(image => {
                    image.thumbnailSize = this.thumbnailSize;
                    const thumbnail = `${image.thumbnailPath}/${image.hash}_${image.thumbnailSize}.jpg`;
                    res.set('Content-Type', 'image/jpeg');

                    if (fs.existsSync(thumbnail)) {
                        return res.sendFile(thumbnail);
                    } else {
                        return this.generator
                            .addJob(image)
                            .then(() => {
                                return res.sendFile(thumbnail);
                            });
                    }
                })
                .catch(e => {
                    LOG('MEDIA ROUTE ERROR', e);
                    res.json(e);
                });
        });

        return this.router;
    }
}

