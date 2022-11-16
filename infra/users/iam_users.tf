resource "aws_iam_user" "ricardo_rincon" {
  name = "Ricardo Rincon"
  email = "ricardo_rm25@hotmail.com"
  path = "/users/"
}

resource "aws_iam_user_group_membership" "developers" {
  user = aws_iam_user.ricardo_rincon

  groups = [
    aws_iam_group.aws_developers_group.name
  ]
}
