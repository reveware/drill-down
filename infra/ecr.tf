// https://jeromedecoster.github.io/aws/github-actions--ecr--ecs/

// https://github.com/terraform-aws-modules/terraform-aws-ecr


module "ecr" {
  source = "terraform-aws-modules/ecr/aws"
  repository_name = "private-ecr-repository"
  repository_lifecycle_policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep last 3 images",
        selection = {
          tagStatus     = "tagged",
          tagPrefixList = ["v"],
          countType     = "imageCountMoreThan",
          countNumber   = 3
        },
        action = {
          type = "expire"
        }
      }
    ]
  })
}