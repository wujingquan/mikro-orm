---
title: Schema 生成器
---

你可以使用 `SchemaGenerator` 助手，根据你的实体元数据(entity metadata)来生成 Schema. 

通过 `CLI` 脚手架工具来使用 `SchemaGenerator`: 

```sh
npx mikro-orm schema:create --dump   # Dumps create schema SQL
npx mikro-orm schema:update --dump   # Dumps update schema SQL
npx mikro-orm schema:drop --dump     # Dumps drop schema SQL
```

> 你也可以直接使用`--run`参数来直接运行生成的SQL语句，但是要小心，因为这样可能会破坏数据库，所以一定要先检查生成的SQL语句，然后再执行。而且不要在生成环境中使用`--run`参数！！！

`schema:create` 如果数据库不存在则会自动创建数据库。

`schema:drop` 默认情况下会删除数据库里面所有的表。 你可以使用 `--drop-db` 参数来删除整个数据库。

或者你可以创建一个像下面一样简单的脚本，然后在脚本里面初始化 `MikroORM`：

**`./create-schema.ts`**

```typescript
import { MikroORM } from 'mikro-orm';

(async () => {
  const orm = await MikroORM.init({
    entities: [Author, Book, ...],
    dbName: 'your-db-name',
    // ...
  });
  const generator = orm.getSchemaGenerator();

  const dropDump = await generator.getDropSchemaSQL();
  console.log(dropDump);

  const createDump = await generator.getCreateSchemaSQL();
  console.log(createDump);

  const updateDump = await generator.getUpdateSchemaSQL();
  console.log(updateDump);

  // there is also `generate()` method that returns drop + create queries
  const dropAndCreateDump = await generator.generate();
  console.log(dropAndCreateDump);

  // or you can run those queries directly, but be sure to check them first!
  await generator.dropSchema();
  await generator.createSchema();
  await generator.updateSchema();

  await orm.close(true);
})();
```

然后通过 `ts-node` 执行该脚本 (或者编译成 JS 然后用 `node` 来执行):

```sh
$ ts-node create-schema
```
