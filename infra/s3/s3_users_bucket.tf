resource "aws_s3_bucket" "users_bucket" {
  bucket = "${var.bucket_prefix}-users-bucket"
}

resource "aws_s3_bucket_public_access_block" "users_bucket_public_access_block" {
  bucket = aws_s3_bucket.users_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "users_bucket_policy" {
  bucket = aws_s3_bucket.users_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = "*",
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ],
        Resource = "${aws_s3_bucket.users_bucket.arn}/*",
      }
    ]
  })
}
