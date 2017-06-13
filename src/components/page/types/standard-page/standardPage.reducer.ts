import { ComponentGroups, addComponentReducers } from 'scripts/component-connect';
import { handleActions } from 'redux-actions';

import { IPageState, PageActions, IPageConfig } from "components/page";
import { AppActions } from 'components/app';
import { IPagePartState } from "components/page-part";

type IPagePartStateMap = { [partName:string]: IPagePartState }
let standardPageReducer = handleActions({
	[AppActions.ActionTypes.SelectPage]: (state: IPageState, action: any): IPageState => {
		return state;
	},
	[PageActions.ActionTypes.SelectItem]: (state: IPageState, action: any) => {
		let newEntityId = action.entityId;
		if (newEntityId == state.selectedEntityId) {
			return state;
		}

		return  {
			...state,
			selectedEntityId: newEntityId
		}
	},
	[PageActions.ActionTypes.ClearItem]: (state: IPageState, action: any) => {
		let clearItem = action.entityId;
		if (clearItem != state.selectedEntityId) {
			return state;
		}

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