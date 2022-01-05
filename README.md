# node-image-gallery-server

Dockerized image gallery server and frontend app. Build with Node.js  
Browse your photo storage, filled with jpg or png files.  
 
![alt text](../master/docs/screenshot_listing.jpg?raw=true "Screenshot Listing")  
![alt text](../master/docs/screenshot_detail_with_stripe.jpg?raw=true "Screenshot Detail Viewer with Stripe")  

### the use case

Primary not for production. Use it on your own risk. I use it in a LAN setup with a stand alone docker server (ubuntu 20 server) in combination with jwilder's nginx proxy.

### setup
- clone this repository
```bash
git clone ...
```

### configure
#### `config/default.config`
1. rename the `config/.default.conf` to `default.config` 
    
This is the shared configuration file. Change:
```apacheconf
STORE_ROOT_PATH=/path/to/my/photos
STORE_THUMBNAIL_PATH=/path/to/the/gallerythumbnails
```

#### `.env.default`
2. rename the file: `.env.default` to `.env`

This is the environment file for docker-compose. All keys from the `default.config` can be overwritten with the `environment:` keys in the docker-compose files.

````apacheconf
STORE_ROOT_PATH=/path/to/my/photos
STORE_THUMBNAIL_PATH=/path/to/the/gallerythumbnails
````

### run it

1. The server app
    ```bash
    docker-compose -f docker-compose-server.yml up -d
    ```

2. The generator app
- Build the image
    ```bash
    docker-compose -f docker-compose-generator.yml up -d
    ```

- run it
    ```bash
    docker-compose -f docker-compose-generator-replicas-binary.yml up -d
    ```

- or run it in development
  ```bash
  docker-compose -f docker-compose-generator-replicas.yml up -d
  ```

3. The frontend build pipeline for development
- For live editing 
  ```bash
  docker-compose -f docker-compose-frontend.yml up -d
  ```

### the proxy
i use [jwilder/nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) to map the apps on a qualified hostname.
- Just run before:
```
docker-compose -f docker-compose-proxy.yml
```
- edit your local `hosts` file. add:
```
xxx.xxx.xxx.xxx gallery.hostname
xxx.xxx.xxx.xxx frontend.gallery.hostname
```
- edit your `.env` and replace `hostname` with your own
```
SERVER_VIRTUAL_HOST=gallery.hostname
FRONTEND_VIRTUAL_HOST=frontend.gallery.hostname
```
