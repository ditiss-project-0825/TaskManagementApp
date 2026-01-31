variable "my_ip" {
  description = "Your public IP with /32"
  type        = string
}

variable "key_name" {
  description = "Existing AWS key pair name"
  type        = string
}

variable "instance_type" {
  default = "m7i-flex.large"
}
