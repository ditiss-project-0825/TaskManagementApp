variable "security_group_id" {
  description = "Existing security group ID"
  type        = string
}


variable "key_name" {
  description = "project"
  type        = string
}

variable "instance_type" {
  default = "m7i-flex.large"
}
