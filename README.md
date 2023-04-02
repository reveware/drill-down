
# Drill Down

This is a pet project, that looks to emulate the typical interactions from a social network, meaning having users, who can add friends, create, tag and comment posts, and some sort of messaging. And It will add some new type of user interactions, such as `Time Bombs`* 

This should eventually serve as a framework to drive the `POV` for the FPS unity project. 


## Running locally

> To run you will need to have the following versions and apps
> Docker >= v.23.0.1 | #33 . ? . 1 + 23 = 33 ? 2 + 1 = 3x3 
> Node >= 14.20.1 
> NPM >= 9.6.2
> Yarn >= 1.22.19 


This project is a monorepo leveraged on [yarn workspaces](https://yarnpkg.com/features/workspaces), so after cloning it you'll need to install the dependencies using 

```bash
cd code
yarn install
```

After that, you'll need to set up the environment variables.
-  for the backend leave a `.env` file at the root of the `code/backend` folder
- for the frontend leave a `.env.local` at the root of the `code/frontend` folder

You can see the `.template` files to get an idea of the variables need, or ask a maintainer. 

At the moment, you can run most of the infra needed locally (mongo, redis) using `docker-compose up` in the `code/backend` but you  will probably also need to create AWS resources (Ex.the S3 bucket used to store the media). For this you can use terraform, just make sure to update the tf_vars in `./infra/env_vars` and make sure they match your `~/aws/credentials` file with the account(s) you want to use.

then apply using those variables with:
```bash
    terraform apply -var-file=env_vars/development.tfvars  
```

You will probably need to add add entries in your `/etc/hosts` file for the docker replicas hostnames (mongo), pointing to your local address (127.0.0.1) to avoid errors connecting to the database.

If everything is set up, you should be able to start the apps from the root folder (you will need at least two terminals):


- `yarn run start:backend` at the root of the `code/backend` folder
- `yarn run start:frontend`  at the root of the `code/frontend` folder

or you can also run them both on each subfolder with:


- `yarn run start` at the root of the `/backend` folder
- `yarn run start`  at the root of the `/frontend` folder




## Contributing

Ideas and suggestions are welcome.

You can submit a pull request on [GitHub](https://github.com/rrriki/drill-down), or if you're thinking about a major changes, you can open an issue first to discuss it.

You can request access to the [Trello board](https://trello.com/b/OTwMAWjI/drill-down) where we keep track of the work.


## License
[MPL 2.0](https://choosealicense.com/licenses/mpl-2.0/)
