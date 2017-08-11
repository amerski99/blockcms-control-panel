import { IContentEntity,IEntity } from 'scripts/entity';
import { IQueryDefinition } from 'scripts/api';
import { IListConfig } from './list.config';

export interface IListState {
    config: IListConfig
    isLoading: boolean
	isFresh: boolean
	selectedEntityId: string
    items: Array<IContentEntity>
}