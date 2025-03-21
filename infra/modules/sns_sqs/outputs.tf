output "image_data_extraction_queue_arn" {
  value = module.image_data_extraction_queue.queue_arn
}

output "extract_image_data_sns_topic_arn" {
  value = module.extract_image_data_sns_topic.topic_arn
}
