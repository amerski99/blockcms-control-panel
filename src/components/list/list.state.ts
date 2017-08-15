import { IContentEntity,IEntity } from 'scripts/entity';
import { IQueryDefinition } from 'scripts/api';
import { IListConfig } from './list.config';

export interface IListState {
    config: IListConfig
    isLoading: boolean
	isStale: boolean
	selectedEntityId: string
    items: Array<IContentEntity>
}