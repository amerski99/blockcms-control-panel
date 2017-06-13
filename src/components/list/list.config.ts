import { IPagePartConfig } from 'components/page-part';
import { IQueryDefinition } from 'scripts/api';

interface IIListConfig extends IPagePartConfig {
	label: string,
	query: IQueryDefinition,
	itemMap: IListItemMapConfig
}

export interface IListItemMapConfig {
	title: string
	subtitle?: string
	imgUrl?: string
}

export type IListConfig = IIListConfig & { type: 'List' };
