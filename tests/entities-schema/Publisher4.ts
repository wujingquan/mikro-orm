import { BaseEntity5 } from './BaseEntity5';
import { Collection } from '../../lib/entity';
import { Book4 } from './Book4';
import { EntitySchema } from '../../lib/schema';
import { Test4 } from './Test4';

export interface Publisher4 extends BaseEntity5 {
  name: string;
  type: string;
  books: Collection<Book4>;
  tests: Collection<Test4>;
}

export enum PublisherType {
  LOCAL = 'local',
  GLOBAL = 'global',
}

export const schema = new EntitySchema<Publisher4>('Publisher4');
schema.setExtends('BaseEntity5');
schema.addProperty('name', 'string', { default: 'asd' });
schema.addOneToMany<Book4>('books', 'Book4', { mappedBy: 'publisher' });
schema.addManyToMany<Test4>('tests', 'Test4', { fixedOrder: true });
schema.addEnum('type', 'PublisherType', { default: 'local' });
