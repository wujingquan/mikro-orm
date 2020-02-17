import { EntitySchema } from '../../lib/schema';
import { Collection } from '../../lib/entity';
import { BaseEntity5 } from './BaseEntity5';
import { DateType, TimeType } from '../../lib/types';
import { Book4 } from './Book4';

export interface Author4 extends BaseEntity5 {
  name: string;
  email: string;
  age?: number;
  termsAccepted?: boolean;
  identities?: string[];
  born?: Date;
  bornTime?: string;
  books: Collection<Book4>;
  favouriteBook?: Book4;
  version?: number;
}

export const schema = new EntitySchema<Author4>('Author4');
schema.setExtends('BaseEntity5');
schema.addProperty('name', 'string');
schema.addProperty('email', 'string', { unique: true });
schema.addProperty('age', 'number', { nullable: true });
schema.addProperty('termsAccepted', 'boolean', { default: 0, onCreate: () => false });
schema.addProperty('identities', 'string[]', { nullable: true });
schema.addProperty('born', DateType, { nullable: true, length: 3 });
schema.addProperty('bornTime', TimeType, { nullable: true, length: 3 });
schema.addOneToMany<Book4>('books', 'Book4', { mappedBy: 'author' });
schema.addManyToOne<Book4>('favouriteBook', 'Book4', {  });
schema.addProperty('version', 'number', { persist: false });
