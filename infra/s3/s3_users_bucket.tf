resource "aws_s3_bucket" "users_bucket" {
  bucket = "${var.bucket_prefix}-users-bucket"
}

resource "aws_s3_bucket_acl" "users_bucket_acl" {
  bucket = aws_s3_bucket.users_bucket.id
  acl    = "public-read-write"
}

