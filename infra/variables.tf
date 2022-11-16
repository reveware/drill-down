locals {
    project_name = "drill-down"
    environment = terraform.workspace
}

variable  "aws_account_id" {
    type = string
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

