data "aws_caller_identity" "current" {}

locals {
  resource_prefix = "${var.project_name}"
  account_id      = data.aws_caller_identity.current.account_id
  tags = {
        Environment = var.environment
        Project     = var.project_name
  } 
}

### S3 Buckets & Policies
module "s3" {
  source          = "../../modules/s3"
  resource_prefix = local.resource_prefix
  tags            = local.tags
  account_id      = local.account_id
}


### SNS & SQS
module "sns_sqs" {
  source          = "../../modules/sns_sqs"
  resource_prefix = local.resource_prefix
  tags            = local.tags
}

### Image Data Extractor Lambda

module "image_data_extractor_lambda_role" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-assumable-role"
  role_name   = "${local.resource_prefix}-image-data-extractor-lambda-role"
  trusted_role_services = ["lambda.amazonaws.com"] 
  create_role = true
  role_requires_mfa = false
}

resource "aws_ecr_repository" "image_data_extractor" {
  name = "${local.resource_prefix}-image-data-extractor"
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
  function_name = "${local.resource_prefix}-image-data-extractor-lambda" 
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
  name        = "${local.resource_prefix}-image-data-extractor-lambda-policy"
  description = "IAM Policy for Image Data Extractor Lambda"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        "Effect": "Allow",
        "Action": ["s3:GetObject"],
        "Resource": ["arn:aws:s3:::${module.s3.users_bucket_id}/*"]
      },
      {
        "Effect": "Allow",
        "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
        "Resource": ["${module.sns_sqs.image_data_extraction_queue_arn}"]
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
  event_source_arn = module.sns_sqs.image_data_extraction_queue_arn
  function_name    = module.image_data_extractor_lambda.lambda_function_name
  batch_size       = 10
}