output "state_bucket_name" {
  description = "Nombre del bucket S3 creado para el estado remoto"
  value       = aws_s3_bucket.terraform_state.bucket
}

output "dynamodb_lock_table" {
  description = "Nombre de la tabla DynamoDB para bloqueo de estado"
  value       = aws_dynamodb_table.terraform_lock.name
}

output "aws_region" {
  description = "Región de AWS usada"
  value       = var.aws_region
}
