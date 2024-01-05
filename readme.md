[![Coverage Status](https://coveralls.io/repos/github/LBtek/clean-ts-api/badge.svg?branch=main)](https://coveralls.io/github/LBtek/clean-ts-api?branch=main)
[![Node.js CI](https://github.com/LBtek/clean-ts-api/actions/workflows/main.yml/badge.svg)](https://github.com/LBtek/clean-ts-api/actions/workflows/main.yml)

# **Survey API**

> ## Endpoints construídos

1. [Cadastro](./requirements/app-services/signup.md)
2. [Login](./requirements/app-services/login.md)

3. [Criar enquete](./requirements/usecases/publisher-context/add-survey.md)

4. [Listar enquetes - Publicador](./requirements/usecases/publisher-context/load-surveys.md)
5. [Listar enquetes - Usuário](./requirements/usecases/user-context/load-surveys.md)
6. [Listar enquetes - Convidado](./requirements/usecases/guest-context/load-surveys.md)

7. [Responder enquete - Usuário](./requirements/usecases/user-context/save-survey-vote.md)
8. [Responder enquete - Convidado](./requirements/usecases/guest-context/save-survey-vote.md)

9. [Ver resultado de uma enquete - Convidado](./requirements/usecases/guest-context/load-survey.md)
10. [Ver resultado de uma enquete - Usuário](./requirements/usecases/user-context/load-survey.md)
11. [Ver resultado de uma enquete - Publicador](./requirements/usecases/publisher-context/load-survey.md)

> ## Princípios

* Single Responsibility Principle (SRP)
* Open Closed Principle (OCP)
* Liskov Substitution Principle (LSP)
* Interface Segregation Principle (ISP)
* Dependency Inversion Principle (DIP)
* Separation of Concerns (SOC)
* Don't Repeat Yourself (DRY)
* You Aren't Gonna Need It (YAGNI)
* Keep It Simple, Silly (KISS)
* Composition Over Inheritance
* Small Commits

> ## Design Patterns

* Factory
* Adapter
* Composite
* Decorator
* Proxy
* Dependency Injection
* Abstract Server
* Composition Root
* Builder
* Singleton

> ## Metodologias e Designs

* TDD
* Clean Architecture
* DDD
* Conventional Commits
* GitFlow
* Modular Design
* Dependency Diagrams
* Use Cases
* Continuous Integration
* Continuous Delivery
* Continuous Deployment

> ## Bibliotecas e Ferramentas

* NPM
* Typescript
* Git
* Docker
* Jest
* MongoDb
* Github Actions CI
* Swagger
* Bcrypt
* JsonWebToken
* Faker
* Coveralls
* Validator
* Zod
* Express
* Apollo Server Express
* Graphql
* Graphql ISO Date
* Supertest
* Husky
* Lint Staged
* Eslint
* Standard Javascript Style
* Nodemon
* Rimraf
* In-Memory MongoDb Server
* MockDate
* Module-Alias
* Copyfiles
* Npm Check
* Bson ObjectId
* Apollo Server Integration Testing

> ## Features do Node

* Documentação de API com Swagger
* API Rest com Express
* GraphQL com Apollo Server
* Log de Erro
* Segurança (Hashing, Encryption e Encoding)
* CORS
* Middlewares
* Nível de Acesso nas Rotas (Publicador, Usuário Básico e Convidado)
* Deploy com PM2 como balanceador de carga
* Servir Arquivos Estáticos

> ## Features do GraphQL

* Types
* Queries
* Mutations
* Resolvers
* Directives
* Scalars
* Plugins

> ## Features do Git

* Alias
* Log Personalizado
* Branch
* Reset
* Amend
* Tag
* Stash
* Rebase
* Merge

> ## Features do Typescript

* POO Avançado
* Interface
* TypeAlias
* Namespace
* Utility Types
* Modularização de Paths
* Configurações
* Build
* Deploy
* Uso de Breakpoints

> ## Features de Testes

* Testes Unitários
* Testes de Integração (API Rest & GraphQL)
* Cobertura de Testes
* Test Doubles
* Mocks
* Stubs
* Spies
* Fakes

> ## Features do MongoDb

* Connect e Reconnect
* Collections
* InsertOne e InserMany
* Find, FindOne e FindOneAndUpdate
* DeleteMany
* UpdateOne
* Aggregation (Match, Group, Unwind, Lookup, AddFields, Project, Sort)
* ObjectId
* Upsert e ReturnOriginal
* Push, Divide, Multiply, ArrayElemAt, Cond, Sum
* Filter, Map, Reduce, MergeObjects, ConcatArrays