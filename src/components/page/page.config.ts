import { IQueryDefinition } from 'scripts/api';
import { IPagePartConfig } from 'components/page-part';

export interface IPageConfig {
	parts: IPagePartMap,
	queries?: Array<IQueryDefinition>
}

interface IPagePartMap {
	[name: string]: IPagePartConfig
}	