
# Getting Started

This page describes how to set up the projects for both the web app and the render pipeline. As well as setting up the required infrastructure either locally with LocalStack or in AWS through terraform.
  

## Requirements

This project has only been tested in Unix environments.

To run it you will need to have the following apps and versions:

  

**Infra**
Docker >= v.24.0.2
Localstack >= 3.2.0


**Social Web**

```
Node >= v16.20.2
NPM >= 9.6.2
Yarn >= 1.22.21
```
  

**Render Pipeline**

```
Python >= 3.10.12
Blender >= 3.5.0
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

  

You can see the `.template` files in each package to see the variables need, or ask a maintainer.

  
### Infra

Use docker-compose to start the required containers (postgres, redis, etc) 

```bash
cd  code/web/@backend
docker-compose up 
``` 

After, you can use [Prisma](https://www.prisma.io/docs/getting-started) commands to initialize the database and run migrations. 

```bash
cd  code/web/@backend
npx  prisma  migrate  dev
npx  prisma  generate
```

#### Terraform & LocalStack 

To create AWS resources like the S3 buckets for media storage you can use [terraform](https://developer.hashicorp.com/terraform) from the `infra` folder, just make sure to update the tf_vars in the `./infra/env_vars` folder and make sure they match your `~/aws/credentials` file with the account(s) you want to use. 

Optionally you can use [localstack](https://docs.localstack.cloud) & [terraform-local](https://github.com/localstack/terraform-local) to create the required infra in your local machine instead. 

For this, you would have to configure `tflocal` using pyton and pip, and then simply use it as you would the `terraform` CLI.
  
Initialize terraform
```bash
terraform init
```

create a workspace for development:
```bash
terraform workspace new development
```

Verify the changes:

```bash
terraform plan -var-file=env_vars/development.tfvars
# Or, for local development
tflocal plan -var-file=env_vars/development.tfvars
```
then use those variables to to create the resources on AWS:

```bash
terraform apply  -var-file=env_vars/development.tfvars
# Or, for local development
tflocal apply  -var-file=env_vars/development.tfvars
```

You can see the list of created resources with:

```bash
terraform state list
```
---

And delete them with:

```bash
terraform destroy -var-file=env_vars/development.tfvars
```

If everything is set up, you should be able to start the apps from the root folder (you will need at least two terminals):

  

-  `yarn run start:backend` at the root of the `/web/@backend` folder

  

-  `yarn run start:frontend` at the root of the `/web/@frontend` folder
  

or you can also run them both on each subfolder with:

  
-  `yarn run start` at the root of the `/web/@backend` folder

  

-  `yarn run start` at the root of the `/web/@frontend` folder

  
You should be able to visit localhost at ports (300 and 8080 by default) to use visit the website and use those services.

  


## Render

You can also test the "Render Pipeline" POC to print mockfiles, using a python script for Blender. As for now, it's just a hardcoded script that will be used to describe the project scene.

  

``` bash

blender  --background  --python  myscript.py

python3  /code/render/@blender/make.py

```
