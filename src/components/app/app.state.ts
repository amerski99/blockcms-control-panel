import { IAppConfig } from 'components/app';
import { IPageState } from 'components/page';

export interface IAppState {
	config: IAppConfig,
	selectedPageName: string,
	pages: {
		[pageName: string]: IPageState
	}
}