
resource "aws_s3_bucket" "assets_bucket" {
  bucket = "${local.project_name}-${local.environment}-assets-bucket"
}

resource "aws_s3_bucket_acl" "assets_bucket_acl" {
  bucket = aws_s3_bucket.assets_bucket.id
  acl    = "private"
}