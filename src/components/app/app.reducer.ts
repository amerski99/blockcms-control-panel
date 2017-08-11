import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

import { ComponentGroups, addComponentReducers } from 'scripts/component-connect';
import { IPageState } from 'components/page';
import { AppActions } from './app.actions';
import { IAppConfig } from './app.config';
import { IAppState } from './app.state';
import { reduceReducers } from "scripts/util";

let appReducer = handleActions({
	[AppActions.ActionTypes.SelectPage]: (state: IAppState, action: any) => {
		let newPageName = action.pageName;

		//console.log('state//', state, action)
		// don't do anything if the page hasn't changed
		if (newPageName == state.selectedPageName) {
			return state;
		}

		return  {
			...state,
			selectedPageName: action.pageName
		}
	}
}, {
	config: {}
})

let componentReducers = addComponentReducers(
	ComponentGroups.Page, 
	(state: IAppState) =>  state.pages,
	(state: { [pageName: string]: IPageState}) => {
		return { pages: state }
	},
	// instead of keeping a record of all the pages states,
	// we only keep a record of the current page state
	// we replicate this by only sending back a map containing the current page
	(state: IAppState) => {
		return state.selectedPageName ? {
			[state.selectedPageName]: {
				...state.config.pages[state.selectedPageName],
				type: 'StandardPage'	// only page type right now
			}
		}: {}
	}
)

appReducer = reduceReducers(appReducer, componentReducers);

export { appReducer }

