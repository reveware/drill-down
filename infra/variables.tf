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

variable "aws_availability_zones" {
    type = list
}

variable "aws_vpc_cidr" {
    type = string
}

variable "aws_vpc_private_subnets" {
    type = list
}

variable "aws_vpc_public_subnets" {
    type = list
}

