module "image_data_extraction_queue" {
  source = "terraform-aws-modules/sqs/aws"
  name   = "${var.resource_prefix}-image-processing"
  tags = var.tags
}

module "extract_image_data_sns_topic" {
  source = "terraform-aws-modules/sns/aws"
  name   = "${var.resource_prefix}-image-processing"
  tags   = var.tags
}


resource "aws_sns_topic_subscription" "sqs_subscription" {
  topic_arn = module.extract_image_data_sns_topic.topic_arn
  protocol  = "sqs"
  endpoint  = module.image_data_extraction_queue.queue_arn
}