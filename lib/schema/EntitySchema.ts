import { AnyEntity, Constructor, EntityMetadata, EntityProperty } from '../typings';
import {
  EnumOptions, ManyToManyOptions, ManyToOneOptions, OneToManyOptions, OneToOneOptions, PrimaryKeyOptions,
  PropertyOptions, SerializedPrimaryKeyOptions,
} from '../decorators';
import { EntityRepository, ReferenceType } from '../entity';
import { Type } from '../types';
import { Utils } from '../utils';

export class EntitySchema<T extends AnyEntity<T> = AnyEntity> {

  private readonly meta: EntityMetadata<T> = { hooks: {}, indexes: [] as any[], uniques: [] as any[] } as EntityMetadata<T>;

  constructor(name: string, meta: Partial<EntityMetadata<T>> = {}) {
    Object.assign(this.meta, meta, { name, className: name, properties: {} });
  }

  static create<T extends AnyEntity<T> = AnyEntity>(meta: EntityMetadata<T>): EntitySchema<T> {
    return new EntitySchema(meta.name, meta);
  }

  addProperty(name: string & keyof T, type: string | Constructor<Type>, options: PropertyOptions = {}): void {
    const prop = { name, type, reference: ReferenceType.SCALAR, ...options };
    this.meta.properties![name] = prop as EntityProperty<T>;
  }

  addEnum(name: string & keyof T, type: string | Constructor<Type>, options: EnumOptions = {}): void {
    if (options.items instanceof Function) {
      const type = options.items();
      const keys = Object.keys(type);
      options.items = Object.values<string>(type).filter(val => !keys.includes(val));
    }

    const prop = { enum: true, ...options };
    this.addProperty(name, type, prop);
  }

  addVersion(name: string & keyof T, type: string | Constructor<Type>, options: PropertyOptions = {}): void {
    const prop = { version: true, ...options };
    this.addProperty(name, type, prop);
  }

  addPrimaryKey(name: string & keyof T, type: string | Constructor<Type>, options: PrimaryKeyOptions = {}): void {
    const prop = { primary: true, ...options };
    this.addProperty(name, type, prop);
  }

  addSerializedPrimaryKey(name: string & keyof T, type: string | Constructor<Type>, options: SerializedPrimaryKeyOptions = {}): void {
    this.meta.serializedPrimaryKey = name;
    this.addProperty(name, type, options);
  }

  addManyToOne<K = object>(name: string & keyof T, type: string | Constructor<Type>, options: ManyToOneOptions<K>): void {
    const prop = { reference: ReferenceType.MANY_TO_ONE, ...options };
    this.addProperty(name, type, prop);
  }

  addManyToMany<K = object>(name: string & keyof T, type: string | Constructor<Type>, options: ManyToManyOptions<K>): void {
    options.fixedOrder = options.fixedOrder || !!options.fixedOrderColumn;

    if (!options.owner && !options.mappedBy) {
      options.owner = true;
    }

    if (options.owner) {
      Utils.renameKey(options, 'mappedBy', 'inversedBy');
    }

    const prop = { reference: ReferenceType.MANY_TO_MANY, ...options };
    this.addProperty(name, type, prop);
  }

  addOneToMany<K = object>(name: string & keyof T, type: string | Constructor<Type>, options: OneToManyOptions<K>): void {
    const prop = { reference: ReferenceType.ONE_TO_MANY, ...options };
    this.addProperty(name, type, prop);
  }

  addOneToOne<K = object>(name: string & keyof T, type: string | Constructor<Type>, options: OneToOneOptions<K>): void {
    const prop = { reference: ReferenceType.ONE_TO_ONE, ...options };
    this.addProperty(name, type, prop);
  }

  setCustomRepository(repository: () => Constructor<EntityRepository<T>>): void {
    this.meta.customRepository = repository;
  }

  setExtends(base: string): void {
    this.meta.extends = base;
  }

  getProperty(name: string & keyof T): EntityProperty<T> {
    return this.meta.properties![name];
  }

  setPrototype(proto: T) {
    this.meta.prototype = proto;
  }

  get path() {
    return '';
  }

  get name() {
    return this.meta.name;
  }

  get prototype() {
    return this.meta.prototype;
  }

  getMetadata(): EntityMetadata<T> {
    // TODO refactor to init method?
    if (!this.meta.prototype) { // TODO this should happen also for user defined prototypes
      const nameIt = (name: string) => ({ [name] : class {} })[name];
      const func = nameIt(this.meta.name);
      this.meta.class = func as Constructor<T>;
      this.meta.prototype = func.prototype as T;
      const pks = Object.values<EntityProperty<T>>(this.meta.properties).filter(prop => prop.primary);

      if (pks.length > 0) {
        this.meta.primaryKey = pks[0].name;
        this.meta.primaryKeys = pks.map(prop => prop.name);
        this.meta.compositePK = pks.length > 1;
      }

      if (this.meta.abstract) {
        delete this.meta.name;
      }

      this.meta.constructorParams = [];
      this.meta.toJsonParams = [];
    }

    return this.meta;
  }

}
