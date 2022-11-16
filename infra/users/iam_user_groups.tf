resource "aws_iam_group" "aws_developers_group" {
    name = "developers"
    path = "/"
}

resource "aws_iam_group_policy_attachment" "assume_developer_role" {
    count = length(aws_iam_policy.assume_developer_role)
    group = aws_iam_group.developers.name
    policy_arn = element(aws_iam_policy.assume_developer_role.*.arn, count.index)
}