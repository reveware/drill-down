variable account_id {
  description = "AWS account ID"
  type        = string
}

variable "resource_prefix" {
  description = "Prefix for resources"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
}