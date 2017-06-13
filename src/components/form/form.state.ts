import { IQueryDefinition } from 'scripts/api';
import { IFormConfig } from 'components/form';
import { IFormItemState } from 'components/form-item';

export interface IFormState {
    config: IFormConfig
    isLoading: boolean
	isSaving: boolean
    currentEntity: IFormCurrentItemState,
	formItems: {
		[name: string]: IFormItemState
	}	
}

export interface IFormCurrentItemState {
    id: string
    isModified: {
        [field: string]: boolean
    }
    readData: {
        [field: string]: any
    }
	origWriteData: {
        [field: string]: any
    }
    writeData: {
        [field: string]: any
    }
}