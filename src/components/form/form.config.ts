import { IQueryDefinition } from 'scripts/api';
import { IPagePartConfig } from 'components/page-part';
import { IFormItemConfig } from 'components/form-item';

interface IIFormConfig extends IPagePartConfig {
	label: string
	formItems: IFormItemConfigMap,
	singleQuery?: IQueryDefinition
	isResetEnabled: boolean
	isClearEnabled: boolean
	isRemoveEnabled: boolean
}

export type IFormConfig = IIFormConfig & { type: 'Form' };

export interface IFormItemConfigMap {
	[name: string]: IFormItemConfig
}
