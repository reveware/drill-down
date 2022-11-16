resource "aws_s3_bucket" "users_bucket" {
  bucket = "users-bucket"
  tags = {
    Project = locals.project_name
    Environment = locals.workspace
  }
}

resource "aws_s3_bucket_acl" "users_bucket_acl" {
  bucket = aws_s3_bucket.users_bucket.id
  acl    = "private"
}


resource "aws_s3_bucket" "assets_bucket" {
  bucket = "assets-bucket"
  tags = {
    Project = locals.project_name
    Environment = locals.workspace
  }
}

resource "aws_s3_bucket_acl" "assets_bucket_acl" {
  bucket = aws_s3_bucket.assets_bucket.id
  acl    = "private"
}