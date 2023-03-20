provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region

  default_tags {
    tags = local.tags
  }

#  # TODO: create Account B
#   assume_role {
#     # role in Account B that allows terraform profile to manage resources
#     rol_arn = "arn:aws:iam::01234567890:role/role_in_account_b"
#   }
}
