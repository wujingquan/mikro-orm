---
title: Schema 生成器
---

To generate schema from your entity metadata, you can use `SchemaGenerator` helper. 

You can use it via CLI: 

```sh
npx mikro-orm schema:create --dump   # Dumps create schema SQL
npx mikro-orm schema:update --dump   # Dumps update schema SQL
npx mikro-orm schema:drop --dump     # Dumps drop schema SQL
```

> 你也可以直接使用`--run`参数来直接运行生成的SQL语句，但是要小心，因为这样可能会破坏数据库，所以一定要先检查生成的SQL语句，然后再执行。而且不要在生成环境中使用`--run`参数！！！

`schema:create` will automatically create the database if it does not exist. 

`schema:drop` will by default drop all database tables. You can use `--drop-db` flag to drop
the whole database instead. 

Or you can create simple script where you initialize MikroORM like this:

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

Then run this script via `ts-node` (or compile it to plain JS and use `node`):

```sh
$ ts-node create-schema
```
