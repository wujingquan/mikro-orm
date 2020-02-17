import { BaseEntity5 } from './BaseEntity5';
import { Collection } from '../../lib/entity';
import { Book4 } from './Book4';
import { EntitySchema } from '../../lib/schema';

export interface BookTag4 extends BaseEntity5 {
  name: string;
  books: Collection<Book4>;
  version: Date;
}

export const schema = new EntitySchema<BookTag4>('BookTag4');
schema.setExtends('BaseEntity5');
schema.addProperty('name', 'string');
schema.addManyToMany<Book4>('books', 'Book4', { mappedBy: 'tags' });
schema.addVersion('version', 'Date');
