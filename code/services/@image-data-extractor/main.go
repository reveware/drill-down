package main

import (
	"log"	
	"github.com/aws/aws-lambda-go/lambda"
)

func handler() (string, error) {
	log.Println("Lambda invoked!")
	return "Processing complete!", nil
}

func main() {
	log.Println("Starting Lambda function...")
	lambda.Start(handler)
}
