# -----------------------------------------------------------------------------
# Network Load Balancer (NLB) con Elastic IP fija
# -----------------------------------------------------------------------------

resource "aws_eip" "nlb" {
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-${var.environment}-nlb-eip"
  }

  depends_on = [var.internet_gateway_id]
}

resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-nlb"
  internal           = false
  load_balancer_type = "network"

  subnet_mapping {
    subnet_id     = var.public_subnet_ids[0]
    allocation_id = aws_eip.nlb.id
  }

  enable_cross_zone_load_balancing = true

  tags = {
    Name = "${var.project_name}-${var.environment}-nlb"
  }
}

resource "aws_security_group" "nlb" {
  name        = "${var.project_name}-${var.environment}-nlb-sg"
  description = "Security group de referencia para el NLB"
  vpc_id      = var.vpc_id

  ingress {
    description = "Permitir trafico entrante a los servicios"
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    description = "Permitir todo el trafico saliente"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-nlb-sg"
  }
}

resource "aws_lb_target_group" "service" {
  for_each = toset([for p in var.service_ports : tostring(p)])

  name        = "${var.project_name}-${var.environment}-tg-${each.value}"
  port        = tonumber(each.value)
  protocol    = "TCP"
  vpc_id      = var.vpc_id
  target_type = "instance"

  health_check {
    enabled             = true
    protocol            = "TCP"
    port                = var.health_check_port == tonumber(each.value) ? "traffic-port" : var.health_check_port
    healthy_threshold   = 2
    unhealthy_threshold = 2
    interval            = 30
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-tg-${each.value}"
  }
}

resource "aws_lb_listener" "service" {
  for_each = aws_lb_target_group.service

  load_balancer_arn = aws_lb.main.arn
  port              = tonumber(each.key)
  protocol          = "TCP"

  default_action {
    type             = "forward"
    target_group_arn = each.value.arn
  }
}
