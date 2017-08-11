import { IQueryDefinition } from 'scripts/api';
import { IFormConfig } from 'components/form';
import { IFormItemState } from 'components/form-item';

export interface IFormState {
    config: IFormConfig
    isLoading: boolean
	isSaving: boolean
	isModified: boolean
	currentEntity: IFormCurrentItemState
	loadEntityId?: string
	isStale: boolean
	formItems: {
		[name: string]: IFormItemState
	}	
}

export interface IFormCurrentItemState {
    id: string
    isModified: {
        [field: string]: boolean
    }
    writeData: {
        [field: string]: any
    }
}