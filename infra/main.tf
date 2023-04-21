module "s3" {
  source = "./s3"
  bucket_prefix = "${local.project_name}-${local.environment}"
}