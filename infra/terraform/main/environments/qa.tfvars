aws_region   = "us-east-1"
project_name = "smart-campus-uce"
environment  = "qa"

vpc_cidr            = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]

# Ajustar al tipo de instancia permitido en AWS Academy.
# t3.small ofrece 2 GB de RAM, mas adecuado para construir las imagenes Docker.
instance_type = "t3.small"

# IMPORTANTE: reemplazar por el nombre de tu Key Pair de AWS Academy
# si quieres acceder por SSH. Si no tienes uno, dejar vacio y todo el
# acceso sera via user-data / recreacion de la instancia.
key_pair_name = "smart-campus-uce-qa-key"

# En AWS Academy los CIDRs de acceso suelen estar restringidos.
# Para un entorno QA se permite acceso desde cualquier lugar.
allowed_cidr_blocks = ["0.0.0.0/0"]

allowed_service_ports = [3000, 3001, 3002, 3003]
root_volume_size      = 20

# Buckets S3 (deben ser unicos globalmente)
app_bucket_name = "smart-campus-uce-app-qa"

# URL del repositorio que se clonara en la instancia EC2
github_repo_url = "https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2.git"
github_branch   = "qa"
