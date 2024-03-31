locals {
    project_name = "drill-down"
    environment = terraform.workspace

    tags = {
        Project = local.project_name
        Environment = local.environment
    }
}

variable "aws_profile" {
    type = string
    default = "default"
}

variable "aws_region" {
    type = string
}
