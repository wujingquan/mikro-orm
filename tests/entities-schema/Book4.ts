import { BaseEntity5 } from './BaseEntity5';
import { Collection } from '../../lib/entity';
import { EntitySchema } from '../../lib/schema';
import { Author4 } from './Author4';
import { Publisher4 } from './Publisher4';
import { BookTag4 } from './BookTag4';

export interface Book4 extends BaseEntity5 {
  title: string;
  author: Author4;
  publisher: Publisher4;
  tags: Collection<BookTag4>;
}

export const schema = new EntitySchema<Book4>('Book4');
schema.setExtends('BaseEntity5');
schema.addProperty('title', 'string');
schema.addManyToOne<Author4>('author', 'Author4', { inversedBy: 'books' });
schema.addManyToOne<Publisher4>('publisher', 'Publisher4', { inversedBy: 'books' });
schema.addManyToMany<BookTag4>('tags', 'BookTag4', { inversedBy: 'books', fixedOrder: true });
