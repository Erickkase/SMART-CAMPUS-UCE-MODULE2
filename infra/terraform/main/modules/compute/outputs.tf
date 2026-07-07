output "launch_template_id" {
  description = "ID del Launch Template"
  value       = aws_launch_template.microservices.id
}

output "autoscaling_group_name" {
  description = "Nombre del Auto Scaling Group"
  value       = aws_autoscaling_group.microservices.name
}

output "security_group_id" {
  description = "ID del security group de las instancias"
  value       = aws_security_group.ec2.id
}

output "efs_file_system_id" {
  description = "ID del filesystem EFS para persistencia"
  value       = aws_efs_file_system.data.id
}

output "efs_dns_name" {
  description = "DNS del filesystem EFS"
  value       = aws_efs_file_system.data.dns_name
}
