data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_security_group" "devsecops_sg" {
  name        = "devsecops-sg"
  description = "Allow SSH, Jenkins, App only from my IP"
}

resource "aws_instance" "devsecops" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.devsecops_sg.id]

  root_block_device {
    volume_size = 25
    volume_type = "gp3"
  }

  tags = {
    Name = "devsecops-jenkins-k8s"
  }
}
