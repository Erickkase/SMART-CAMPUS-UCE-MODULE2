aws_region   = "us-west-2"
project_name = "smart-campus-uce"
environment  = "qa"

vpc_cidr            = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]

# t3.medium: 2 vCPU / 4 GB RAM. Minimo recomendado para el stack completo.
# Si el presupuesto de AWS Academy lo permite, usar t3.large (8 GB).
instance_type = "t3.medium"

# Nombre del Key Pair creado en AWS Academy para acceso SSH.
key_pair_name = "one-jule-2026"

# Acceso abierto para ambiente QA.
allowed_cidr_blocks = ["0.0.0.0/0"]

# Puertos expuestos por los microservicios y el api-gateway.
allowed_service_ports = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 8080]
root_volume_size      = 20

# Volumen EBS para persistencia de bases de datos Docker (GB).
data_volume_size = 30

# Buckets S3 (deben ser unicos globalmente)
app_bucket_name = "smart-campus-uce-app-qa-west2-832682702884"

# Rama a desplegar desde GitHub
github_repo_url = "https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2.git"
github_branch   = "qa"
