## Project setup

```bash
$ npm install
```

## Database Setup

```bash
#Запуск контейнера postgress
$  docker-compose up -d
$  npm install
$  prisma:generate
#Сброс базы 
$  prisma:reset,
#Запуск миграция
$  prisma:migrate,
#Добаление данных
$  prisma:seed
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



