data "aws_caller_identity" "current" {}

locals {
  project_prefix = "${var.project_name}-${var.environment}"
  tags = {
        Environment = var.environment
        Project     = var.project_name
  } 
}

### S3 Buckets & Policies

module "users_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  bucket  = "${local.project_prefix}-users-bucket"
  control_object_ownership = true
  object_ownership         = "BucketOwnerEnforced"
  force_destroy = true
  tags = local.tags
}

resource "aws_s3_bucket_public_access_block" "users_bucket_block" {
  bucket                  = module.users_bucket.s3_bucket_id
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false 
  restrict_public_buckets = false

  depends_on = [module.users_bucket]
}

resource "aws_s3_bucket_policy" "users_bucket_policy" {
  bucket = module.users_bucket.s3_bucket_id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      # TODO: Should use Roles for Allow
      {
        Sid       = "PublicReadGetObject"
        Effect    = var.environment == "development" ? "Allow" : "Deny"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${module.users_bucket.s3_bucket_id}/*"
      },
      {
        Sid       = "AllowWriteFromAWSAuth"
        Effect    = "Allow"
        Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }
        Action    = ["s3:PutObject", "s3:DeleteObject"]
        Resource  = "arn:aws:s3:::${module.users_bucket.s3_bucket_id}/*"
        Condition = {
          "Bool" = { "aws:SecureTransport" = "true" }
        }
      }
    ]
  })
   
   depends_on = [aws_s3_bucket_public_access_block.users_bucket_block]
}

module "assets_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  bucket  = "${local.project_prefix}-assets-bucket"
  control_object_ownership = true
  force_destroy = true
  object_ownership         = "BucketOwnerEnforced"
  tags = local.tags
}

### SQS & SNS Subscriptions

module "image_data_extraction_queue" {
  source = "terraform-aws-modules/sqs/aws"
  name   = "${local.project_prefix}-image-processing"
  tags = local.tags
}

module "extract_image_data_sns_topic" {
  source  = "terraform-aws-modules/sns/aws"
  name    = "${local.project_prefix}-image-processing"

    topic_policy  = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "AllowAccountOnly"
        Effect    = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action    = "sns:Publish"
        Resource = "arn:aws:sns:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${local.project_prefix}-image-processing"

      }
    ]
  })

  tags = local.tags
}

resource "aws_sns_topic_subscription" "sqs_subscription" {
  topic_arn = module.extract_image_data_sns_topic.topic_arn
  protocol  = "sqs"
  endpoint  = module.image_data_extraction_queue.queue_arn
}


### Image Data Extractor Lambda

module "image_data_extractor_lambda_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  role_name   = "${local.project_prefix}-image-data-extractor-lambda-role"
  trusted_role_services = ["lambda.amazonaws.com"] 
  create_role = true
  role_requires_mfa = false
}

resource "aws_ecr_repository" "image_data_extractor" {
  name = "${local.project_prefix}-image-data-extractor"
  image_tag_mutability = "MUTABLE"
  force_delete = true

  image_scanning_configuration {
    scan_on_push = true
  }

  lifecycle {
    ignore_changes = [image_tag_mutability] 
  }

  provisioner "local-exec" {
    command = <<EOT
      AWS_ACCOUNT_ID=${data.aws_caller_identity.current.account_id}
      AWS_REGION=${var.aws_region}
      ECR_REPO_NAME=${aws_ecr_repository.image_data_extractor.name}
      IMAGE_TAG="latest"

      # Authenticate Docker with ECR
      aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

      # Pull an official AWS-managed image as default
      docker pull public.ecr.aws/amazonlinux/amazonlinux:latest
      docker tag public.ecr.aws/amazonlinux/amazonlinux:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG

      # Push the AWS public image to ECR with "latest" tag
      docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG
    EOT
  }
}

resource "aws_ecr_lifecycle_policy" "image_data_extractor_policy" {
  repository = aws_ecr_repository.image_data_extractor.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep only the latest image"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 1
      }
      action = {
        type = "expire"
      }
    }]
  })
}

module "image_data_extractor_lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  function_name = "${local.project_prefix}-image-data-extractor-lambda" 
  package_type  = "Image"
  create_package = false
  image_uri     = "${aws_ecr_repository.image_data_extractor.repository_url}:latest"
  lambda_role   =  module.image_data_extractor_lambda_role.iam_role_arn
  create_role = false
  environment_variables = merge(var.image_data_extractor_lambda_settings.environment, { ENV = var.environment })
  tags = local.tags

  depends_on = [aws_ecr_repository.image_data_extractor, aws_ecr_lifecycle_policy.image_data_extractor_policy]
}

module "image_data_extractor_lambda_policies" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
  name        = "${local.project_prefix}-image-data-extractor-lambda-policy"
  description = "IAM Policy for Image Data Extractor Lambda"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        "Effect": "Allow",
        "Action": ["s3:GetObject"],
        "Resource": ["arn:aws:s3:::${module.users_bucket.s3_bucket_id}/*"]
      },
      {
        "Effect": "Allow",
        "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
        "Resource": ["${module.image_data_extraction_queue.queue_arn}"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "image_data_extractor_lambda_policy_attachment" {
  role      = module.image_data_extractor_lambda_role.iam_role_name
  policy_arn = module.image_data_extractor_lambda_policies.arn
}

resource "aws_iam_role_policy_attachment" "image_data_extractor_lambda_execution_role_policy_attachment" {
  role      = module.image_data_extractor_lambda_role.iam_role_name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_event_source_mapping" "image_data_extractor_lambda_sqs_trigger" {
  event_source_arn = module.image_data_extraction_queue.queue_arn
  function_name    = module.image_data_extractor_lambda.lambda_function_name
  batch_size       = 10
}