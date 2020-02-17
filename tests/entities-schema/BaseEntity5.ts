import { EntitySchema } from '../../lib/schema';
import { IdEntity } from '../../lib';

export interface BaseEntity5 extends IdEntity<BaseEntity5> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export const schema = new EntitySchema<BaseEntity5>('BaseEntity5', { abstract: true });
schema.addPrimaryKey('id', 'number');
schema.addProperty('createdAt', 'Date', { onCreate: () => new Date(), nullable: true });
schema.addProperty('updatedAt', 'Date', { onCreate: () => new Date(), onUpdate: () => new Date(), nullable: true });
