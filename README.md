<h3 align="center">
  Laionpedia API Project
</h3>

<p align="center">An rest api for football teams historical data management system. 👨🏼‍💻🦁</p>

<p align="center">
  <a href="#-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-docs">Docs</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
</p>

## 📊 About the project

In recent years, technology has become increasingly relevant in the world of football. One of the key areas where it has been widely utilized is in engaging fans by providing access to historical data, a valuable resource for those looking to deepen their understanding of their favorite club's history. However, current platforms for showcasing historical data often face challenges such as lack of accessibility, limited interactivity, and difficulties in presenting comprehensive information in an engaging manner.

This project aims to develop a historical data platform that addresses these issues, offering fans an immersive and user-friendly experience to explore the rich history of their club, including matches, championships, coaches, executives, and players.

Creating an engaging platform for fans to learn about their club's history is essential for strengthening the connection between the club and its supporters. Additionally, offering innovative solutions for accessibility and interactivity can enhance the fan experience and foster a deeper appreciation for the club's legacy.

## 🚀 Technologies

Technologies that I used to develop this api

- [TypeScript](https://www.typescriptlang.org/)
- [Bun](https://bun.sh/)
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

I used [swagger](https://swagger.io/) to document the API. You can access ``/docs``.

---

Made with ❤️ &nbsp;by Eduardo Bernardino 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/dudubernardino/)
