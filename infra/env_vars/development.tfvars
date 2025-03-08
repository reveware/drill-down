aws_profile = "default"
aws_region = "us-east-1"
environment = "development"

image_data_extractor_lambda_settings = {
    image_tag = "latest"
    environment   = { "API_KEY" = "super"  } 
}