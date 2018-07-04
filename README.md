# Hotel-Client

## Prerequisites 

A linux dist like Ubuntu is recommended since this is the only platform this has been tested on, however since we are using platform independent tools this should work on any platform that is supported by node.js and nwjs.

### Node modules

- Install node.js either via command line using your favorite package manager or see [here](https://nodejs.org/en/download/package-manager).
- Run `npm install` in the projects root directory to install its dependencies.

### NWJS

- You'll need to download the [nwjs-sdk](https://nwjs.io/) (you really need the sdk version).
- Unpack the zip in the projects root directory.
- Rename the previously unpacked directory to `nwjs-sdk`.
- Run `sh run.sh` (for linux dists)

## Usage

Type the base url into the url bar at the top and click load (default is our hotel-api which is deployed on heroku).
If you try other APIs note that you must not leave a `/` at the end of the entered URL.
You might need to wait a little because there's some async stuff happening.
Do not touch the url bar from now on!
Since it serves as our base address, you will most likely end up having 404 errors in case you change it.

Below the url bar you now find the response json, a list of classes as well as the corresponding operations the API provides.
Note that our hotel-api backend expects _ids_ (merely digits no refs) for link attributes.
This might be different for other backends.
Next to each operation button (except POST) you find a field in which you can specify an id to operate on.
If you do not specify an id for a get, you get a list of the corresponding entity.

## But is it generic?

As far as we can tell it is pretty generic since we don't hardcode anything "hotel-api-related" into the client.
It also seems work for Markus Lanthalers example [backend](http://www.markus-lanthaler.com/hydra/api-demo).
Note that some operations for his demo seem to be broken since they don't even work when using his hydra-console application.

## Hydra Core Complications

Since the hydra-core module seems to be broken as well, we did our best to implement the important parts ourself.
One operation that did not work for example was `findOperation`, which is pretty essential.
So what we did was to try to make sense of the data we're getting while trying to keep it generic.

## Known bugs/errors/issues/todos/etc

- Make actions independent of the content of the url bar to prevent confusion.
- Posts are as of now generated artificially.
- Refs in the response json should be "clickable".
- Use a template engine to generate html.
