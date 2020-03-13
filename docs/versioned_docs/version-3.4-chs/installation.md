---
title: 安装 & 使用
---

首先通过`yarn`或`npm`来安装此模块，除此之外还不要忘记了安装对应的数据库驱动：

```sh
$ yarn add mikro-orm mongodb # for mongo
$ yarn add mikro-orm mysql2  # for mysql/mariadb
$ yarn add mikro-orm mariadb # for mysql/mariadb
$ yarn add mikro-orm pg      # for postgresql
$ yarn add mikro-orm sqlite3 # for sqlite
```

或

```sh
$ npm i -s mikro-orm mongodb # for mongo
$ npm i -s mikro-orm mysql2  # for mysql/mariadb
$ npm i -s mikro-orm mariadb # for mysql/mariadb
$ npm i -s mikro-orm pg      # for postgresql
$ npm i -s mikro-orm sqlite3 # for sqlite
```

<!-- Next you will need to enable support for [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
in `tsconfig.json` via: -->
接下来，您需要通过以下方式在`tsconfig.json`中启用对[装饰器](https://www.typescriptlang.org/docs/handbook/decorators.html)的支持：

```json
"experimentalDecorators": true
```

<!-- Then call `MikroORM.init` as part of bootstrapping your app: -->
然后在启动您的应用程序时调用`MikroORM.init`：

```typescript
const orm = await MikroORM.init({
  entities: [Author, Book, BookTag],
  dbName: 'my-db-name',
  clientUrl: '...', // defaults to 'mongodb://localhost:27017' for mongodb driver
  baseDir: __dirname, // defaults to `process.cwd()`
});
console.log(orm.em); // access EntityManager via `em` property
```

> 在[高级配置](configuration.md)部分中详细了解所有可能的配置选项。

You can also provide paths where you store your entities via `entitiesDirs` array. Internally
it uses [`globby`](https://github.com/sindresorhus/globby) so you can use 
[globbing patterns](https://github.com/sindresorhus/globby#globbing-patterns). 

```typescript
const orm = await MikroORM.init({
  entitiesDirs: ['./dist/app/**/entities'],
  // ...
});
```

You should provide list of directories, not paths to entities directly. If you want to do that
instead, you should use `entities` array and use `globby` manually:

```typescript
import globby from 'globby';

const orm = await MikroORM.init({
  entities: await globby('./dist/app/**/entities/*.js').map(require),
  // ...
});
```

> You can pass additional options to the underlying driver (e.g. `mysql2`) via `driverOptions`. 
> The object will be deeply merged, overriding all internally used options.

## Entity Discovery in TypeScript

Internally, `MikroORM` uses [`ts-morph` to perform analysis](metadata-providers.md) of source files 
of entities to sniff types of all properties. This process can be slow if your project contains lots 
of files. To speed up the discovery process a bit, you can provide more accurate paths where your
entity source files are: 

```typescript
const orm = await MikroORM.init({
  entitiesDirs: ['./dist/entities'], // path to your JS entities (dist), relative to `baseDir`
  entitiesDirsTs: ['./src/entities'], // path to your TS entities (source), relative to `baseDir`
  // ...
});
```

You can also use different [metadata provider](metadata-providers.md) or even write custom one:

- `ReflectMetadataProvider` that uses `reflect-metadata` instead of `ts-morph`
- `JavaScriptMetadataProvider` that allows you to manually provide the entity schema (mainly for Vanilla JS)

```typescript
const orm = await MikroORM.init({
  metadataProvider: ReflectMetadataProvider,
  // ...
});
```

## Setting up the Commandline Tool

MikroORM ships with a number of command line tools that are very helpful during development, 
like Schema Generator and Entity Generator. You can call this command from the NPM binary 
directory or use `npx`:

```sh
$ node node_modules/.bin/mikro-orm
$ npx mikro-orm

# or when installed globally
$ mikro-orm
```

For CLI to be able to access your database, you will need to create `mikro-orm.config.js` file that 
exports your ORM configuration. TypeScript is also supported, just enable `useTsNode` flag in your
`package.json` file. There you can also set up array of possible paths to `mikro-orm.config` file,
as well as use different file name:

> Do not forget to install `ts-node` when enabling `useTsNode` flag.

**`./package.json`**

```json
{
  "name": "your-app",
  "dependencies": { ... },
  "mikro-orm": {
    "useTsNode": true,
    "configPaths": [
      "./src/mikro-orm.config.ts",
      "./dist/mikro-orm.config.js"
    ]
  }
}
```

**`./src/mikro-orm.config.ts`**

```typescript
export default {
  entities: [Author, Book, BookTag],
  dbName: 'my-db-name',
  type: 'postgresql',
};
```

Once you have the CLI config properly set up, you can omit the `MikroORM.init()` options
parameter and the CLI config will be automatically used. 

> You can also use different names for this file, simply rename it in the `configPaths` array
> your in `package.json`. You can also use `MIKRO_ORM_CLI` environment variable with the path
> to override `configPaths` value.

Now you should be able to start using the CLI. All available commands are listed in the CLI help:

```sh
Usage: mikro-orm <command> [options]

Commands:
  mikro-orm cache:clear        Clear metadata cache
  mikro-orm generate-entities  Generate entities based on current database schema
  mikro-orm schema:create      Create database schema based on current metadata
  mikro-orm schema:drop        Drop database schema based on current metadata
  mikro-orm schema:update      Update database schema based on current metadata

Options:
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]

Examples:
  mikro-orm schema:update --run  Runs schema synchronization
```

To verify your setup, you can use `mikro-orm debug` command.

> When you have CLI config properly set up, you can omit the `options` parameter
> when calling `MikroORM.init()`.

## Request Context

Then you will need to fork Entity Manager for each request so their identity maps will not 
collide. To do so, use the `RequestContext` helper:

```typescript
const app = express();

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});
```

More info about `RequestContext` is described [here](identity-map.md#request-context).

Now you can start [defining your entities](defining-entities.md) (in one of the `entitiesDirs` folders).
