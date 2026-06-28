# Infraestructura AWS con Terraform

Infraestructura como código para desplegar los microservicios del proyecto **SMART CAMPUS UCE - Módulo 2** en AWS. Diseñada para funcionar dentro de las limitaciones típicas de **AWS Academy**.

## Contenido

- [Arquitectura](#arquitectura)
- [Estructura de directorios](#estructura-de-directorios)
- [Requisitos previos](#requisitos-previos)
- [Configuración inicial](#configuración-inicial)
- [Despliegue paso a paso](#despliegue-paso-a-paso)
- [Consideraciones para AWS Academy](#consideraciones-para-aws-academy)
- [URLs de acceso](#urls-de-acceso)
- [Solución de problemas](#solución-de-problemas)

## Arquitectura

```text
                    Internet
                       |
               [Security Group]
                       |
                 [EC2 t3.micro]
                /              \
    [Docker Compose]            [VPC + Subnet pública]
        |                              |
   [Microservicios]              [Internet Gateway]
   - scholarship-service         [S3 - Terraform state]
   - socioeconomic-form-service  [DynamoDB - State lock]
   - psychological-care-service  [S3 - App storage]
   - welfare-frontend
   - PostgreSQL (x2)
   - MongoDB
```

- **Todo en una sola instancia EC2**: los microservicios, PostgreSQL y MongoDB corren como contenedores Docker mediante `docker-compose.yml`.
- **Sin IAM roles**: la instancia EC2 no usa roles ni instance profiles, compatible con cuentas de AWS Academy sin permisos IAM.
- **Sin ALB/ELB**: los servicios se exponen directamente por los puertos de la instancia EC2.
- **Backend remoto S3 + DynamoDB**: el estado de Terraform se guarda en S3 con bloqueo en DynamoDB.

## Estructura de directorios

```text
infra/terraform/
├── bootstrap/              # Crea S3 bucket y tabla DynamoDB para el state
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── providers.tf
├── main/                   # Infraestructura principal
│   ├── modules/
│   │   ├── network/        # VPC, subnets, IGW, route tables
│   │   ├── compute/        # EC2, security groups
│   │   └── storage/        # Bucket S3 de aplicación
│   ├── environments/
│   │   └── qa.tfvars       # Variables del ambiente QA
│   ├── templates/
│   │   └── user-data.sh.tpl # Script de inicialización de la EC2
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── providers.tf
│   └── backend.tf
├── scripts/
│   ├── bootstrap.sh        # Ejecutar una sola vez
│   ├── init.sh             # Inicializa backend S3
│   └── deploy.sh           # Plan / apply / destroy
└── README.md
```

## Requisitos previos

1. **Terraform >= 1.5.0** instalado localmente.
2. **AWS CLI** configurado con las credenciales de AWS Academy:
   ```bash
   aws configure
   ```
3. **Key Pair SSH** (opcional pero recomendado): crear uno en la consola de AWS Academy si quieres acceder por SSH a la instancia.
4. **Git** instalado.

## Configuración inicial

### 1. Revisar variables del ambiente

Edita `main/environments/qa.tfvars` y ajusta al menos:

```hcl
key_pair_name = "nombre-de-tu-key-pair"  # opcional
app_bucket_name = "nombre-unico-global-app-qa"
github_repo_url = "https://github.com/tu-usuario/SMART-CAMPUS-UCE-MODULE2.git"
```

> El bucket S3 para el estado (`smart-campus-uce-terraform-state`) también debe ser único globalmente. Si ya está tomado, edítalo en `bootstrap/variables.tf`.

### 2. Crear bucket S3 y tabla DynamoDB (bootstrap)

Este paso se ejecuta **una sola vez** por cuenta de AWS:

```bash
chmod +x infra/terraform/scripts/*.sh
./infra/terraform/scripts/bootstrap.sh
```

Esto creará:

- Bucket S3: `smart-campus-uce-terraform-state`
- Tabla DynamoDB: `smart-campus-uce-terraform-lock`

## Despliegue paso a paso

### 1. Inicializar backend remoto

```bash
./infra/terraform/scripts/init.sh qa us-east-1 smart-campus-uce-terraform-state smart-campus-uce-terraform-lock
```

### 2. Revisar el plan

```bash
./infra/terraform/scripts/deploy.sh plan qa
```

### 3. Aplicar la infraestructura

```bash
./infra/terraform/scripts/deploy.sh apply qa
```

Al finalizar, Terraform mostrará las URLs de acceso a los servicios.

### 4. Destruir la infraestructura (opcional)

```bash
./infra/terraform/scripts/deploy.sh destroy qa
```

> Recuerda que AWS Academy tiene créditos limitados. Destruye los recursos cuando no los uses.

## Consideraciones para AWS Academy

- **Sin permisos IAM**: la plantilla NO crea roles, policies ni instance profiles. Si tu cuenta tiene más permisos y quieres usar SSM Session Manager, puedes agregar un IAM role opcional más adelante.
- **Sin Elastic IP**: la IP pública de la instancia EC2 es dinámica. Si reinicias la instancia, la IP cambiará y el frontend dejará de apuntar correctamente a los servicios. Para un ambiente QA esto es aceptable.
- **Sin ALB**: los puertos de los microservicios están abiertos directamente en el security group.
- **Todo en EC2**: PostgreSQL y MongoDB corren como contenedores en la misma instancia. Esto simplifica el despliegue y evita depender de RDS aunque lo tengas habilitado.
- **Tipo de instancia**: por defecto usa `t3.micro`. Verifica que tu cuenta de AWS Academy permita lanzar este tipo de instancia; si no, cámbialo en `main/environments/qa.tfvars`.

## URLs de acceso

Después del despliegue, los servicios estarán disponibles en:

| Servicio | URL |
|----------|-----|
| scholarship-service | `http://<EC2_PUBLIC_IP>:3000` |
| socioeconomic-form-service | `http://<EC2_PUBLIC_IP>:3001` |
| psychological-care-service | `http://<EC2_PUBLIC_IP>:3002` |
| welfare-frontend | `http://<EC2_PUBLIC_IP>:3003` |

La IP pública se muestra en los outputs de Terraform.

## Solución de problemas

### No puedo acceder a los servicios

1. Verifica que la instancia EC2 esté en estado `running`.
2. Revisa el security group y que tu IP esté dentro de `allowed_cidr_blocks`.
3. Consulta los logs de user-data:
   ```bash
   ssh -i tu-key.pem ec2-user@<EC2_PUBLIC_IP>
   sudo tail -f /var/log/user-data.log
   ```

### La IP pública cambió

Si reiniciaste la instancia y no tienes Elastic IP, la IP cambiará. Para recuperar el acceso:

1. Obtén la nueva IP desde la consola de AWS o desde los outputs de Terraform.
2. Reconstruye el frontend con las nuevas URLs (puedes ejecutar el `user-data` nuevamente o recrear la instancia).

### Error de permisos al crear recursos

AWS Academy suele tener políticas restrictivas. Si Terraform falla al crear algún recurso:

1. Revisa el mensaje de error de AWS.
2. Elimina recursos no soportados (por ejemplo, si no puedes crear Elastic IPs, asegúrate de que la plantilla actual no las use).
3. Consulta con tu instructor de AWS Academy sobre los límites de la cuenta.
