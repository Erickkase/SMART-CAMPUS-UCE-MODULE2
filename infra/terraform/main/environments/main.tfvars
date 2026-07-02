aws_region   = "us-west-2"
project_name = "smart-campus-uce"
environment  = "main"

vpc_cidr            = "10.0.0.0/16"
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]

# t3.medium: 2 vCPU / 4 GB RAM. Minimum recommended for the full stack.
# If AWS Academy budget allows, use t3.large (8 GB).
instance_type = "t3.medium"

# AWS Academy key pair name for SSH access.
key_pair_name = "one-jule-2026"

# Open access for QA environment.
allowed_cidr_blocks = ["0.0.0.0/0"]

# Ports exposed by microservices and the API gateway.
allowed_service_ports = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 8080]
root_volume_size      = 30

# S3 buckets (must be globally unique)
app_bucket_name = "smart-campus-uce-app-main-west2-832682702884"

# GitHub repository branch to deploy on the EC2 instance
github_repo_url = "https://github.com/Erickkase/SMART-CAMPUS-UCE-MODULE2.git"
github_branch   = "main"
