# Image Data Extractor

A Go service to process and extract structured data from images.


### Test
Build and tag the image:

```sh
docker buildx build --platform linux/amd64 -t image-data-extractor .

```

You can test the lambda using the [Lambda Runtime Interface Emulator](https://github.com/aws/aws-lambda-runtime-interface-emulator/)

Start the docker image:
```sh
docker run -p 9000:8080 --name image-data-extractor --entrypoint /usr/local/bin/aws-lambda-rie image-data-extractor:latest /main

```


This command runs the image as a container and creates a local endpoint at `localhost:9000/2015-03-31/functions/function/invocations`
You can invoke the function with a payload by making a requests to the endpoint

```sh
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'

```
