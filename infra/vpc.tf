// https://github.com/terraform-aws-modules/terraform-aws-vpc

module "vpc" {
    source = "terraform-aws-modules/vpc/aws"
    name = "drill-down-${terraform.workspace}"
    cidr = var.aws_vpc_cidr
    azs = var.aws_availability_zones
    private_subnets = var.aws_vpc_private_subnets
    public_subnets = var.aws_vpc_public_subnets
    enable_nat_gateway = false
    enable_vpn_gateway = false
}