aws_profile = "drill-down-dev"
aws_account_id = "404828645950"
aws_region = "us-east-1"
aws_availability_zones = ["us-east-1a", "us-east-1b"]
aws_vpc_cidr = "192.168.0.0/22" // 1024 addresses, for 4 subnets = 256 addresses each
aws_vpc_private_subnets = ["192.168.0.0/24","192.168.1.0/24"]
aws_vpc_public_subnets = ["192.168.2.0/24", "192.168.3.0/24"]