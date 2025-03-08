
# Getting Started

This page describes how to set up the projects for both the web app and the render pipeline. As well as setting up the required infrastructure either locally with LocalStack or in AWS through terraform.
  

## Requirements

This project has only been tested in Unix environments.

To run it you will need to have the following apps and versions:
  

**Infra**
```bash
Docker >= v.24.0.2
Terraform >=  v1.7.5
Localstack >= 3.2.0
```

**Social Web**
```bash
Node >= v16.20.2
NPM >= 9.6.2
Yarn >= 1.22.21
```


## Web

The web project is a node monorepo leveraged using [yarn workspaces](https://yarnpkg.com/features/workspaces)

You'll need to install the dependencies using:
  
```bash

cd  drill-down/code/web
yarn  install
```
After that, you'll need to set up the environment variables.

  

- for the backend create a `.env` file at the root of the `web/@backend` folder

  

- for the frontend create a `.env.local` at the root of the `web/@frontend` folder

  

You can see the `.env.template` files for reference, or ask a maintainer if you find issues.

  
## Infra

For local development you can use docker-compose to start most of the required infrastructure (postgres, redis). Make sure to include the necessary .env variables as well.

```bash
cd  infra/docker
docker-compose up 
``` 

After, you can use [Prisma](https://www.prisma.io/docs/getting-started) commands to initialize the database and run migrations. 

```bash
cd  code/web/@backend
npx  prisma  migrate  dev
npx  prisma  generate
```

### Terraform & LocalStack 

To create AWS resources, you can use [terraform](https://developer.hashicorp.com/terraform) along with the `settings.tfvars` from the `infra` folder.

> Make sure you have the right credentials at ~/.aws/credentials  

Optionally you could use [localstack](https://docs.localstack.cloud) & [terraform-local](https://github.com/localstack/terraform-local) to create the required infra in your local machine instead. 

For this, you would have to configure `tflocal` using pyton and pip, and then simply use it as you would the `terraform` CLI.
  
Initialize terraform
```bash
terraform init
```

Verify the changes:

```bash
terraform plan -var-file=settings.tfvars
# Or, for local development
tflocal plan -var-file=settings.tfvars
```
Create the resources on AWS:

```bash
terraform apply  -var-file=settings.tfvars
# Or, for local development
tflocal apply  -var-file=settings.tfvars
```

You can see the list of created resources with:

```bash
terraform state list
```
---

And delete them with:

```bash
terraform destroy -var-file=settings.tfvars
```

If everything is set up, you should be able to start the apps from the root folder (you will need at least two terminals):

  

-  `yarn run start:backend` at the root of the `/web/@backend` folder

  

-  `yarn run start:frontend` at the root of the `/web/@frontend` folder
  

or you can also run them both on each subfolder with:

  
-  `yarn run start` at the root of the `/web/@backend` folder

  

-  `yarn run start` at the root of the `/web/@frontend` folder

  
You should be able to visit localhost at ports (3000 and 8080 by default) to use visit the website and use those services.

