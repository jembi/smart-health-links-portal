export interface IRepository<T>{
    insert(entity: T): Promise<T>;
    insertMany(entities: T[]): Promise<T[]>;
    findById(id: string | number): Promise<T>;
    findOne(filter: any): Promise<T | undefined>;
    findMany(filters?: any): Promise<T[]>;
    update(entity: T): Promise<T>;
    delete(entity: T): Promise<T>;
}

interface KeyValue {
    key: string, 
    value: any
}

export interface Filter{
    eq: KeyValue,
    lt: KeyValue,
    gt: KeyValue,
    gte: KeyValue,
    lte: KeyValue,
    ne: KeyValue
}

export interface LogicOperator{
    and?: KeyValue[],
    or?: KeyValue[],
    where?: any
}
export interface QueryFilter{
    filters: LogicOperator[]
}