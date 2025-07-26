# Project setup
## Env variables

Copy the env variables from email to .env file in root of project

## Postgress
Provided with the project is a postgress docker compose file. You can start the postgress database with Adminer DBMS with the following command (if Docker is installed)

```bash
cd <project root>

docker compose up
```

## Node

Install nvm (node version manager)  
For UNIX: https://github.com/nvm-sh/nvm

After the installation go into the project root directory:

```bash
cd <project root>

# If the correct node version is not installed use:
nvm install
# If its already installed use
nvm use

# Install dependencies
npm install
```

## Migrations

Run the following command to perform the initial database setup

```bash
cd <project root>

npm run migrate
```

## Starting and building the project

```bash
cd <project root>

npm run build

npm start
```

After that, the console will output the port in se for the backend service.