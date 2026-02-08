terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

# -----------------------------
# Security Group
# -----------------------------
resource "aws_security_group" "ec2_sg" {
  name        = "devsecops-sg"
  description = "Security group for DevSecOps EC2"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "devsecops-sg"
  }
}

# -----------------------------
# EC2 Instance
# -----------------------------
resource "aws_instance" "devsecops" {
  ami           = "ami-019715e0d74f695be"
  instance_type = "m7i-flex.large"
  key_name      = "one"   # <-- your key pair name

  vpc_security_group_ids = [
    aws_security_group.ec2_sg.id
  ]

  root_block_device {
    volume_size = 25
    volume_type = "gp3"
  }

  tags = {
    Name = "devsecops-jenkins-k8s"
  }
}

# -----------------------------
# Outputs
# -----------------------------
output "public_ip" {
  value = aws_instance.devsecops.public_ip
}

# -----------------------------
# Generate Ansible Inventory
# -----------------------------
resource "null_resource" "write_inventory" {
  provisioner "local-exec" {
    command = <<EOT
mkdir -p ../ansible
echo "[jenkins]" > ../ansible/inventory.ini
echo "${aws_instance.devsecops.public_ip} ansible_user=ec2-user ansible_ssh_private_key_file=~/one" >> ../ansible/inventory.ini
EOT
  }

  depends_on = [aws_instance.devsecops]
}
