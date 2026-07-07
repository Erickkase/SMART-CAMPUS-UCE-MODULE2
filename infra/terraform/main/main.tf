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

module "loadbalancer" {
  source = "./modules/loadbalancer"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id              = module.network.vpc_id
  public_subnet_ids   = module.network.public_subnet_ids
  internet_gateway_id = module.network.internet_gateway_id
  allowed_cidr_blocks = var.allowed_cidr_blocks
  service_ports       = var.allowed_service_ports
  health_check_port   = 3000
  health_check_path   = "/health"
}

module "compute" {
  source = "./modules/compute"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.network.vpc_id
  subnet_ids            = [module.network.public_subnet_ids[0]]
  instance_type         = var.instance_type
  key_pair_name         = var.key_pair_name
  allowed_cidr_blocks   = var.allowed_cidr_blocks
  allowed_service_ports = var.allowed_service_ports
  root_volume_size      = var.root_volume_size
  asg_min_size          = var.asg_min_size
  asg_max_size          = var.asg_max_size
  asg_desired_capacity  = var.asg_desired_capacity
  target_group_arns     = module.loadbalancer.target_group_arns
  nlb_security_group_id = module.loadbalancer.security_group_id

  github_repo_url = var.github_repo_url
  github_branch   = var.github_branch
  nlb_ip          = module.loadbalancer.nlb_elastic_ip
}

module "storage" {
  source = "./modules/storage"

  project_name    = var.project_name
  environment     = var.environment
  app_bucket_name = var.app_bucket_name
}
