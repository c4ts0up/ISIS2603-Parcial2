## Descripción

Parcial de "Programación Web"

Álvaro Bacca

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

### Unitarias
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### E2E
Antes de correr los tests, se requiere desplegar una base de datos PostgreSQL localmente con las credenciales provistas
en el archivo `local.env`. Asimismo, se debe crear una tabla, `parcial2`.

A continuación, se debe correr el archivo ``test/test-setup.http`` para configurar algunas entradas de pruebas necesarias
para correr las pruebas de Postman.

Finalmente, una vez hecho esto, se debe cargar el ambiente de Postman (``test/postman/ISIS2603-Parcial2.postman_environment.json``)
para después correr las pruebas E2E (``test/postman/ISIS2603-Parcial2.postman_collection.json``)

En esta colección de pruebas también se encuentra la documentación.

Se realizaron estas pruebas de acuerdo con los casos presentados en el documento guía. Adicionalmente, se utilizaron
para validar el pipeline de validación que funciona globalmente para la aplicación y se aplica al convertir el JSON a 
los DTOs. Se procuró cubrir un gran número de casos de uso para explorar la lógica implementada extensivamente.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.
