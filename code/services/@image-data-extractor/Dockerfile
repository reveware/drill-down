# Build stage: Compiles the Go code
FROM golang:1.20 AS build
WORKDIR /image-data-extractor

COPY go.mod go.sum ./
RUN go mod download 

COPY main.go .
RUN GOOS=linux GOARCH=amd64 go build -tags lambda.norpc -o main main.go

# Runtime stage: Runs the compiled Go for Lambda
FROM public.ecr.aws/lambda/provided:al2023
WORKDIR /

COPY --from=build /image-data-extractor/main /main

RUN chmod +x /main

ENTRYPOINT [ "/main" ]