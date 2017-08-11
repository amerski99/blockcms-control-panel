import { IFormItemConfig } from 'components/form-item';

export interface IFormItemState {
	name: string
	config: IFormItemConfig
	value: any
	origValue: any
	isLoaded: boolean
}
