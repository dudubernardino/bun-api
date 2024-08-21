<h3 align="center">
  🦊 Users API Project
</h3>

<p align="center">An simple rest api for users.</p>

<p align="center">
  <a href="#-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-docs">Docs</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

## 📊 About the project

Users back-end app built with TypeScript, Drizzle a ElysiaJS.

> 🔥 This project aims to keep runtime agnostic, this means it should work on Bun, Node or any Web Standard API compatible runtime.

## 🚀 Technologies

Technologies that I used to develop this api

- [Bun](https://bun.sh/)
- [Elysia](https://elysiajs.com/)
- [Drizzle](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)
- [Docker](https://www.docker.com/)
- [Eslint](https://www.npmjs.com/package/@dudubernardino/eslint-config)

## 💻 Getting started

### Requirements

- [Bun](https://bun.sh/)
- One instance of [PostgreSQL](https://www.postgresql.org/)

> Obs.: I recommend to use docker

**Clone the project and access the folder**

```bash
$ git clone https://github.com/dudubernardino/laionpedia-api && cd laionpedia-api
```

**Follow the steps below**

```bash
# Install the dependencies
$ bun install

# Make a copy of '.env.example' to '.env'
# and set with YOUR environment variables.
# The aws variables do not need to be filled for dev environment
$ cp .env.example .env

# Create the instance of postgreSQL using docker compose
$ docker compose up -d

# To finish, run the api service
$ bun dev

# Well done, project is started!
```

## 📚 Docs

I used [swagger](https://swagger.io/) to document the API. You can access `/docs`.

## 🤔 How to contribute

**Make a fork of this repository**

```bash
# Fork using GitHub official command line
# If you don't have the GitHub CLI, use the web site to do that.

$ gh repo fork dudubernardino/bun-api
```

**Follow the steps below**

```bash
# Clone your fork
$ git clone your-fork-url && cd bun-api

# Create a branch with your feature
$ git checkout -b my-feature

# Make the commit with your changes
$ git commit -m 'feat: My new feature'

# Send the code to your remote branch
$ git push origin my-feature
```

After your pull request is merged, you can delete your branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ &nbsp;by Eduardo Bernardino 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/dudubernardino/)
