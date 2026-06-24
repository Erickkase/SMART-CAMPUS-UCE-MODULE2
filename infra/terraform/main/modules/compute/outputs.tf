output "instance_id" {
  description = "ID de la instancia EC2"
  value       = aws_instance.microservices.id
}

output "instance_public_ip" {
  description = "IP pública de la instancia EC2"
  value       = aws_instance.microservices.public_ip
}

output "instance_public_dns" {
  description = "DNS público de la instancia EC2"
  value       = aws_instance.microservices.public_dns
}

output "security_group_id" {
  description = "ID del security group de la instancia"
  value       = aws_security_group.ec2.id
}
