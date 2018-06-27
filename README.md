# hotel-client

## installation

You'll need to download the [nwjs-sdk](https://nwjs.io/).
Unpack the zip and run `sh run.sh`.

## usage

Type the base url in the url bar and click load (default is our hotel-api which is deployed on heroku).
You might need to wait a little because there's some async stuff happening.
Do not touch the url bar from now on!
Since it serves as our base address, you will most likely end up having 404 errors if you change anything in the bar.

Below the url bar you now find the response json and below that a list of classes and the corresponding operations the API provides.
Note that our hotel-api backend expects _ids_ for attributes which are links.
If you do not specify an id for a get you get a list of the corresponding entity.

## complications

Since the hydra core seems to be broken, we did our best to implement the important parts ourself.
One operation that did not work for example was `findOperation`, which is pretty essential.
So what we did was to try to make sense of the data we're getting and we also tried to keep it generic.
As far as we can tell it is pretty generic since we don't hardcode anything hotel-api related into the client.
Thus it seems to also work for Markus Lanthalers example [backends](http://www.markus-lanthaler.com/hydra/api-demo).
