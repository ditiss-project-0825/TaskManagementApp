data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] 

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "devsecops" {
  ami           = "ami-019715e0d74f695be"
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [
    sg-09b27e01a0486c54b  
  ]

  root_block_device {
    volume_size = 25
    volume_type = "gp3"
  }

  tags = {
    Name = "devsecops-jenkins-k8s"
  }
}
