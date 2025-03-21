module "users_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  bucket  = "${var.resource_prefix}-users-bucket"
  control_object_ownership = true
  object_ownership         = "BucketOwnerEnforced"
  force_destroy = true

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false

  tags = var.tags
}

resource "aws_s3_bucket_policy" "users_bucket_policy" {
  bucket = module.users_bucket.s3_bucket_id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      # TODO: Should use Roles for Allow
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "arn:aws:s3:::${module.users_bucket.s3_bucket_id}/*"
      },
      {
        Sid       = "AllowWriteFromAWSAuth"
        Effect    = "Allow"
        Principal = { AWS = "arn:aws:iam::${var.account_id}:root" }
        Action    = ["s3:PutObject", "s3:DeleteObject"]
        Resource  = "arn:aws:s3:::${module.users_bucket.s3_bucket_id}/*"
        Condition = {
          "Bool" = { "aws:SecureTransport" = "true" }
        }
      }
    ]
  })
   
   depends_on = [module.users_bucket]
}

module "assets_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  bucket  = "${var.resource_prefix}-assets-bucket"
  control_object_ownership = true
  force_destroy = true
  object_ownership         = "BucketOwnerEnforced"
  tags = var.tags
}