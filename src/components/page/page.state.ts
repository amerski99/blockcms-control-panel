import { IPagePartState } from 'components/page-part';
import { IPageConfig } from './page.config';


export interface IPageState {
	config: IPageConfig
	selectedEntityId?: string
	parts: {
		[name: string]: IPagePartState
	}	
}
