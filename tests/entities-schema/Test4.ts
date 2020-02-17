import { BaseEntity5 } from './BaseEntity5';
import { EntitySchema } from '../../lib/schema';

export interface Test4 extends BaseEntity5 {
  name?: string;
  version: number;
}

export const schema = new EntitySchema<Test4>('Test4');
schema.setExtends('BaseEntity5');
schema.addProperty('name', 'string', { nullable: true });
schema.addProperty('version', 'number', { version: true });
