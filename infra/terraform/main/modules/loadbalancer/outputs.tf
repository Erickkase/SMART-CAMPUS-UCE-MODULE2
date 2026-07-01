output "nlb_arn" {
  description = "ARN del Network Load Balancer"
  value       = aws_lb.main.arn
}

output "nlb_dns_name" {
  description = "DNS del Network Load Balancer"
  value       = aws_lb.main.dns_name
}

output "nlb_elastic_ip" {
  description = "Elastic IP asociada al NLB"
  value       = aws_eip.nlb.public_ip
}

output "security_group_id" {
  description = "ID del security group de referencia del NLB"
  value       = aws_security_group.nlb.id
}

output "target_group_arns" {
  description = "Mapa de puertos a ARNs de target groups"
  value       = { for port, tg in aws_lb_target_group.service : tonumber(port) => tg.arn }
}
