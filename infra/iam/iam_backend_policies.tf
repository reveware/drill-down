resource aws_iam_role backend_role {
  name               = "${local.project_name}-ecs-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role_policy_data.json
}


# Allows ECS Service to assume "backend_role" 
data aws_iam_policy_document ecs_task_assume_role_policy_data {
  effect = "Allow"
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# Allow backend role to read/write to S3
data "aws_iam_policy_document" "allow_s3_access" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
    ]

    resources = [
      aws_s3_bucket.users_bucket.arn,
      aws_s3_bucket.assets_bucket.arn
    ]
  }
}

resource "aws_iam_role_policy_attachment" "attach_allow_s3_access_policy" {
  role       = aws_iam_role.backend_role.name
  policy_arn = aws_iam_policy.allow_s3_access.arn
}

# 