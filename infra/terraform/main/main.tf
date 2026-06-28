locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

module "network" {
  source = "./modules/network"

  project_name        = var.project_name
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
}

module "compute" {
  source = "./modules/compute"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.network.vpc_id
  subnet_id             = module.network.public_subnet_ids[0]
  instance_type         = var.instance_type
  key_pair_name         = var.key_pair_name
  allowed_cidr_blocks   = var.allowed_cidr_blocks
  allowed_service_ports = var.allowed_service_ports
  root_volume_size      = var.root_volume_size
  user_data = templatefile("${path.module}/templates/user-data.sh.tpl", {
    github_repo_url = var.github_repo_url
    github_branch   = var.github_branch
    project_name    = var.project_name
    environment     = var.environment
  })
}

module "storage" {
  source = "./modules/storage"

  project_name    = var.project_name
  environment     = var.environment
  app_bucket_name = var.app_bucket_name
}
