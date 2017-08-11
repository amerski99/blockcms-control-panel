import { IQueryDefinition } from 'scripts/api';
import { IPagePartConfig } from 'components/page-part';
import { IComponentConfig } from "scripts/component-connect";

export interface IPageConfig extends IComponentConfig {
	parts: IPagePartMap,
	queries?: Array<IQueryDefinition>
}

interface IPagePartMap {
	[name: string]: IPagePartConfig
}	