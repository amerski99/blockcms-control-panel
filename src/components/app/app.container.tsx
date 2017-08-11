import * as React from 'react';
import { applyMiddleware, createStore, Dispatch } from 'redux';
import { connect, Provider, Store } from 'react-redux';
import thunk from 'redux-thunk';

import { appReducer } from './app.reducer';
import { IAppState } from './app.state';
import { AppActions } from './app.actions';
import { App as AppView } from './app.view';

import InitialConfig from 'config';
import { middleware as componentMiddleware } from 'scripts/component-connect/middleware';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const store: Store<any> = createStore(
	appReducer,
	{ config: InitialConfig } as IAppState,	
	composeEnhancers(applyMiddleware(componentMiddleware, thunk))
);


const mapStateToProps = (state: IAppState):any  => {
	return {
		config: state.config,
		selectedPage: state.selectedPageName
	}
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		onPageSelect: (pageName: string) => {
			console.log('select page ' + pageName);
			dispatch(AppActions.selectPage(pageName))
		}
	}
}

const ConnectedApp = connect(
	mapStateToProps,
	mapDispatchToProps
)(AppView)

export class AppRedux extends React.Component<{}, {}> {
	render() {
		return (
			<Provider store={store}>
				<ConnectedApp />
			</Provider>
		)
	}
}