output "vpc_id" {
  description = "ID de la VPC creada"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "IDs de las subnets públicas"
  value       = module.network.public_subnet_ids
}

output "nlb_dns_name" {
  description = "DNS del Network Load Balancer"
  value       = module.loadbalancer.nlb_dns_name
}

output "nlb_elastic_ip" {
  description = "Elastic IP fija asociada al NLB"
  value       = module.loadbalancer.nlb_elastic_ip
}

output "autoscaling_group_name" {
  description = "Nombre del Auto Scaling Group"
  value       = module.compute.autoscaling_group_name
}

output "launch_template_id" {
  description = "ID del Launch Template"
  value       = module.compute.launch_template_id
}

output "efs_dns_name" {
  description = "DNS del filesystem EFS para persistencia de datos"
  value       = module.compute.efs_dns_name
}

output "app_bucket_name" {
  description = "Nombre del bucket S3 de la aplicacion"
  value       = module.storage.app_bucket_name
}

output "service_urls" {
  description = "URLs de acceso a los servicios desplegados mediante la Elastic IP fija"
  value = {
    scholarship_service        = "http://${module.loadbalancer.nlb_elastic_ip}:3000"
    socioeconomic_form_service = "http://${module.loadbalancer.nlb_elastic_ip}:3001"
    psychological_care_service = "http://${module.loadbalancer.nlb_elastic_ip}:3002"
    welfare_frontend           = "http://${module.loadbalancer.nlb_elastic_ip}:3003"
    subject_service            = "http://${module.loadbalancer.nlb_elastic_ip}:3004"
    enrollment_service         = "http://${module.loadbalancer.nlb_elastic_ip}:3005"
    student_service            = "http://${module.loadbalancer.nlb_elastic_ip}:3006"
    notification_service       = "http://${module.loadbalancer.nlb_elastic_ip}:3007"
    api_gateway                = "http://${module.loadbalancer.nlb_elastic_ip}:8080"
  }
}
