# Drill Down

This is a pet project, that looks to emulate the typical interactions from a social network: whereyou can create users, who can add friends, create, tag and comment posts, interact with each other via messaging. This project also adds an interesting feature, giving users new interactions, such as `Time Bombs`*

This Web App should eventually serve as a framework to drive the `POV` FPS UE5 project and the Render series Blender project.

you can find more information about the idea under `/docs` , as well as a postman collection to get started.

## Running locally

To run you will need to have the following apps and versions  

**Social Web**
```
Docker >= v.24.0.2
Node >= v16.20.2
NPM >= 9.6.2
Yarn >= 1.22.21
```

**Render Pipeline**
```
Blender >= 3.5.0
```

---

#### Web
The web project is a node monorepo leveraged using [yarn workspaces](https://yarnpkg.com/features/workspaces), and it's been tested only in Unix environments. 

You'll need to install the dependencies using:

To start the Social Web project

```bash
cd  drill-down/code/web
yarn install
```

After that, you'll need to set up the environment variables.

- for the backend create a `.env` file at the root of the `web/@backend` folder

- for the frontend create a `.env.local` at the root of the `web/@frontend` folder

You can see the `.template` files in each package to see the variables need, or ask a maintainer.


#### Databases
At the moment, you can run most of the infra needed (postgres, mongo, redis) locally using `docker-compose up` in the `web/@backend` 

With the containers running, you will want to use [Prisma](https://www.prisma.io/docs/getting-started) to create the database tables and run migrations:

```bash
cd code/backend/web/@backend
npx prisma migrate dev
npx prisma generate
```


You will probably also need to add add entries in your `/etc/hosts` file for the docker replicas hostnames (mongo), pointing to your local address (127.0.0.1) to avoid errors connecting to the database.

  
#### Storage
 
You will probably also need to create AWS resources (Ex.the S3 bucket used to store the media). For this you can use terraform from the `infra` folder, just make sure to update the tf_vars in the `./infra/env_vars` folder and make sure they match your `~/aws/credentials` file with the account(s) you want to use. Avoid commiting this file.

then use those variables to to create the resources on AWS:

```bash
terraform apply  -var-file=env_vars/development.tfvars
```

--- 
If everything is set up, you should be able to start the apps from the root folder (you will need at least two terminals):

- `yarn run start:backend` at the root of the `/web/@backend` folder

- `yarn run start:frontend` at the root of the `/web/@frontend` folder


or you can also run them both on each subfolder with:  
  

- `yarn run start` at the root of the `/web/@backend` folder

- `yarn run start` at the root of the `/web/@frontend` folder

You should be able to visit localhost at ports (300 and 8080 by default) to use visit the website and use those services.


### Render 
You can also test the "Render Pipeline" POC to print mockfiles, using a python script for Blender. As for now, it's just a hardcoded script that will be used to describe the project scene.

``` bash
blender --background --python myscript.py
python /code/render/@blender/make.py
```

## Scene description

There's a great value for designers to understand the prop definition. and being able to output the desired result. This json could describe either a single object, or prop, detailed as needed. It can also be an animation, using a Timeline of this object interact with other props win a given "scene".


## Contributing

Ideas and suggestions are welcome.

You can submit a pull request on [GitHub](https://github.com/reveware/drill-down), or if you're thinking about a major changes, you can open an issue first to discuss it.

You can request access to the [Trello board](https://trello.com/b/OTwMAWjI/drill-down) where we keep track of the work.
  
## License

[MPL 2.0](https://choosealicense.com/licenses/mpl-2.0/)