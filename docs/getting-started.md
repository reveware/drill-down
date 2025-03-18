
# Getting Started

This page provides instructions for setting up and running the Web app, along with its infrastructure. You can run some required services locally using Docker, or provision them in AWS using Terraform.
  
A [postman collection](./postman.json) is available to help with API testing.

## Requirements

This project has only been tested in Unix environments.

To run it you will need to have the following apps and versions:  

| Component | Version |
| --- | --- |
| Node | >= 18.20.7 |
| Yarn | >= 4.7.0 |
| Docker | >= 24.0.2 |
| Terraform | >= 1.7.5 |

## Web App Set up

The web project is a Typescript monorepo using [yarn workspaces](https://yarnpkg.com/features/workspaces)

### Install Dependencies
  
```bash
cd  drill-down/code/web
yarn  install
```

### Set up environment variables
Each service requireis specific variables

- Backend: Create a `.env` at `web/@backend`
- Frontend: Create a `.env.local` at `web/@frontend`

You can reference the provided `.env.template` files, or ask a maintainer for required values.

  
## Infrastructure Set up

For local development you can use docker-compose to start most of the required infrastructure, like Postgres and Redis.


```bash
cd  infra/docker
docker-compose up 
``` 

You can optionally start the backend with docker using the [profile](https://docs.docker.com/reference/compose-file/services/#profiles) `backend` 

```bash
docker compose --profile backend up
```

> Note: Ensure you set up a .env for docker-compose 


## Database Set Up 
The database is managed and provisioned with [PrismaORM](https://www.prisma.io/docs/getting-started). 

Run migrations and generate the Prisma client: 

```bash
cd  code/web/@backend
npx  prisma  migrate  dev
npx  prisma  generate
```

## Cloud Infrastructure (Terraform + AWS) 

To deploy AWS resources, use [terraform](https://developer.hashicorp.com/terraform).

> Note: Make sure you have the right credentials at ~/.aws/credentials  
  
Initialize terraform

```bash
cd infra
terraform init
```

Verify the changes:

```bash
terraform plan -var-file=settings.tfvars
```
Create the resources on AWS:

```bash
terraform apply  -var-file=settings.tfvars
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

## Running the Web App
Once everything is set up, you should be able to start the backend and frontend manually, open two terminals and run:

### Start Backend
```bash
cd code/web
yarn run start:backend
```
The backend should be accessible at: http://localhost:8080

### Start Frontend
```bash
cd code/web
yarn run start:frontend

```
The frontend should be accessible at: http://localhost:3000


