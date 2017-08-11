import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { ISelector } from 'scripts/component-connect';

function wrapTo(selector: ISelector<any, any>, action: any, componentNames: Array<string>, path:string) {
	return {
		type: ComponentMiddlewareActionTypes.Forward, 
		payload: action, 
		selector,
		componentNames,
		path
	};
}

// returns a new dispatch that wraps and forwards the actions with the given name
export function forwardDispatchTo(dispatch: Dispatch<any>, selector: ISelector<any, any>, componentNames: Array<string>) {
	let path = componentNames.join(' => ');
	let result:any = (action: any) => dispatch(wrapTo(selector, action, componentNames, path));
	result.path = path;
	return result;
}

export const ComponentMiddlewareActionTypes = {
	Forward: 'COMPONENT-MW.FORWARD'
};

export const middleware = <S>(api: MiddlewareAPI<S>) => 
	(next: Dispatch<S>) => 
		(action: any) => {
    		if (typeof action !== 'function' && action.type === ComponentMiddlewareActionTypes.Forward) {
      			if (typeof action.payload === 'function') {
					let forwardDispatch = forwardDispatchTo(api.dispatch, action.selector, action.componentNames);
					let getSelectedState = () => action.selector(api.getState());
					return action.payload(forwardDispatch, getSelectedState);
				}
				else {
					let newAction;
					if (action.payload) {
						let componentNames = (action.componentNames && action.componentNames.slice()) || [] as Array<string>;
						let meta = {
							componentNames,
							path: action.path	
						};

						newAction = Object.assign({}, action.payload, { meta });
					}
					return next(newAction);
				}
    		}

    		return next(action);
		}