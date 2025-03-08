
variable "aws_profile" {
    type = string
    default = "default"
}

variable "aws_region" {
    type = string
}

variable "project_name" {
  type        = string
  default     = "drill-down"
}

variable "environment" {
  type        = string

}

variable "image_data_extractor_lambda_settings" {
    description ="Settings for the image data extractor lambda"
    type        = object({
    image_tag       = string
    environment   = map(string)
  })
}
