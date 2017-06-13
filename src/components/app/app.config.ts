import { IMenuConfig } from 'components/menu';
import { IPageConfig } from 'components/page';

export interface IAppConfig {
	menu: IMenuConfig;
	pages: IPageMapConfig
}

export interface IPageMapConfig {
	[pageName: string]: IPageConfig;
}
