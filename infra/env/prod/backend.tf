terraform {
  backend "s3" {
    bucket         = "drill-down-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}
