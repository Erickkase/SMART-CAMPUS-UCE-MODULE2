output "vpc_id" {
  description = "ID de la VPC creada"
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "IDs de las subnets públicas"
  value       = module.network.public_subnet_ids
}

output "ec2_instance_id" {
  description = "ID de la instancia EC2 de microservicios"
  value       = module.compute.instance_id
}

output "ec2_public_ip" {
  description = "IP pública de la instancia EC2"
  value       = module.compute.instance_public_ip
}

output "ec2_public_dns" {
  description = "DNS público de la instancia EC2"
  value       = module.compute.instance_public_dns
}

output "app_bucket_name" {
  description = "Nombre del bucket S3 de la aplicacion"
  value       = module.storage.app_bucket_name
}

output "service_urls" {
  description = "URLs de acceso a los servicios desplegados. NOTA: la IP publica cambia si reinicias la instancia (sin Elastic IP)."
  value = {
    scholarship_service        = "http://${module.compute.instance_public_ip}:3000"
    socioeconomic_form_service = "http://${module.compute.instance_public_ip}:3001"
    psychological_care_service = "http://${module.compute.instance_public_ip}:3002"
    welfare_frontend           = "http://${module.compute.instance_public_ip}:3003"
  }
}
