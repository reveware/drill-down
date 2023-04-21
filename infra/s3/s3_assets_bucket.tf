
resource "aws_s3_bucket" "assets_bucket" {
  bucket = "${var.bucket_prefix}-assets-bucket"
}

resource "aws_s3_bucket_acl" "assets_bucket_acl" {
  bucket = aws_s3_bucket.assets_bucket.id
  acl    = "private"
}