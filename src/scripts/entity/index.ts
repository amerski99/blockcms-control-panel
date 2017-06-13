export interface IEntity {
    id: string
}

export interface IContentEntity extends IEntity {
	fields: { [name:string]: any }
}