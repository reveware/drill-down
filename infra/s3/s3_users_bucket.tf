resource "aws_s3_bucket" "users_bucket" {
  bucket = "${local.project_name}-${local.environment}-users-bucket"
}

resource "aws_s3_bucket_acl" "users_bucket_acl" {
  bucket = aws_s3_bucket.users_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_policy" "allow_post_access_to_current_user" {
  bucket = aws_s3_bucket.users_bucket.id
  policy = data.aws_iam_policy_document.allow_post_access_to_current_user.json
}


