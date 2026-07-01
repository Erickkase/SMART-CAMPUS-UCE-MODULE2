data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-${var.environment}-ec2-sg"
  description = "Security group para las instancias EC2 de microservicios"
  vpc_id      = var.vpc_id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  dynamic "ingress" {
    for_each = var.allowed_service_ports
    content {
      description = "Servicio puerto ${ingress.value}"
      from_port   = ingress.value
      to_port     = ingress.value
      protocol    = "tcp"
      cidr_blocks = var.allowed_cidr_blocks
    }
  }

  egress {
    description = "Permitir todo el trafico saliente"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-ec2-sg"
  }
}

resource "aws_security_group" "efs" {
  name        = "${var.project_name}-${var.environment}-efs-sg"
  description = "Security group para el filesystem EFS de persistencia"
  vpc_id      = var.vpc_id

  ingress {
    description     = "NFS desde las instancias EC2"
    from_port       = 2049
    to_port         = 2049
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    description = "Permitir todo el trafico saliente"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-efs-sg"
  }
}

resource "aws_efs_file_system" "data" {
  creation_token = "${var.project_name}-${var.environment}-data"
  encrypted      = true

  tags = {
    Name = "${var.project_name}-${var.environment}-data"
  }
}

resource "aws_efs_mount_target" "data" {
  count           = length(var.subnet_ids)
  file_system_id  = aws_efs_file_system.data.id
  subnet_id       = var.subnet_ids[count.index]
  security_groups = [aws_security_group.efs.id]
}

resource "aws_launch_template" "microservices" {
  name          = "${var.project_name}-${var.environment}-lt"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
  key_name      = var.key_pair_name != "" ? var.key_pair_name : null
  user_data = base64encode(templatefile("${path.module}/../../templates/user-data.sh.tpl", {
    github_repo_url = var.github_repo_url
    github_branch   = var.github_branch
    project_name    = var.project_name
    environment     = var.environment
    nlb_ip          = var.nlb_ip
    efs_dns         = aws_efs_file_system.data.dns_name
  }))

  vpc_security_group_ids = [aws_security_group.ec2.id]

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size           = var.root_volume_size
      volume_type           = "gp3"
      delete_on_termination = true
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-${var.environment}-microservices"
    }
  }

  tag_specifications {
    resource_type = "volume"
    tags = {
      Name = "${var.project_name}-${var.environment}-root-volume"
    }
  }
}

resource "aws_autoscaling_group" "microservices" {
  name                = "${var.project_name}-${var.environment}-asg"
  vpc_zone_identifier = var.subnet_ids
  desired_capacity    = var.asg_desired_capacity
  min_size            = var.asg_min_size
  max_size            = var.asg_max_size
  health_check_type   = "EC2"

  launch_template {
    id      = aws_launch_template.microservices.id
    version = "$Latest"
  }

  target_group_arns = values(var.target_group_arns)

  tag {
    key                 = "Name"
    value               = "${var.project_name}-${var.environment}-asg-instance"
    propagate_at_launch = true
  }

  depends_on = [aws_efs_mount_target.data]
}
