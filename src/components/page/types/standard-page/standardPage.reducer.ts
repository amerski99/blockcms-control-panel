import { ComponentGroups, addComponentReducers } from 'scripts/component-connect';
import { handleActions } from 'redux-actions';

import { IPageState, IPageConfig } from 'components/page';
import { AppActions } from 'components/app';
import { IPagePartState } from 'components/page-part';
import { FormActions } from 'components/form';
import { ListActions } from 'components/list';

type IPagePartStateMap = { [partName:string]: IPagePartState }
let standardPageReducer = handleActions({
	[AppActions.ActionTypes.SelectPage]: (state: IPageState, action: any): IPageState => {
		return state;
	},
	[ListActions.ActionTypes.SelectEntity]: (state: IPageState, action: any) => {
		let newEntityId = action.entityId;
		if (newEntityId == state.selectedEntityId) {
			return state;
		}

		return  {
			...state,
			selectedEntityId: newEntityId
		}
	},
	[FormActions.ActionTypes.Clear]: (state: IPageState, action: any) => {
		return  {
			...state,
			selectedEntityId: undefined
		}
	}	
}, {
	parts: {}
})

standardPageReducer = addComponentReducers(
	ComponentGroups.PagePart, 
	(state: IPageState) =>  state.parts,
	(state: IPagePartStateMap) => {
		return { parts: state }
	},
	(state: IPageState) => state.config.parts,
	standardPageReducer
)

export { standardPageReducer }