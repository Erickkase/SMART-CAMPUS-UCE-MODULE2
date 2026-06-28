output "app_bucket_name" {
  description = "Nombre del bucket S3 de la aplicacion"
  value       = aws_s3_bucket.app.bucket
}

output "app_bucket_arn" {
  description = "ARN del bucket S3 de la aplicacion"
  value       = aws_s3_bucket.app.arn
}
