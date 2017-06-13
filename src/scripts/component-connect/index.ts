import * as React from 'react';
import { ActionCreator, Dispatch } from 'redux';
import { connect as reduxConnect } from 'react-redux';
import { reduceReducers } from "scripts/util";


export enum ComponentGroups {
	Global,
	Page,
	PagePart,
	ListView,
	FormItem
}

export interface IComponentConfig<TPropEnd> {
	group: ComponentGroups
	name: string
	viewClass: React.ComponentClass<TPropEnd>
	reducer?(state: any, action: any, parentState: any): any
}

export function wrapComponent<TStateStart, TStateEnd, TProp>(
	componentGroup: ComponentGroups,
	componentNameSupplier: ISelector<string, TProp>,
	selectorSupplier: ISelectorSupplier<TProp, TStateEnd, TStateStart>
): React.ComponentClass<TProp> {
	let componentSetupSupplier = (prop: TProp) => getComponentFromRegistry(componentGroup, componentNameSupplier(prop));

	type TPropWrap = TProp & IDispatchProp;

	class ComponentWrapper extends React.Component<TPropWrap, {}> {
		componentClass: React.ComponentClass<TPropWrap>
		selector: ISelector<TStateEnd, any>
		parentSelector: ISelector<TStateStart, any>
		constructor(props: TPropWrap, ctx: any) {
			super(props, ctx)
			let componentSetup = componentSetupSupplier(props);
			let selector = selectorSupplier(props);
			this.componentClass = componentSetup.containerClassSupplier(selector);
			this.selector = computeSelector(selector, ctx);
			this.parentSelector = getParentSelector(ctx);
		}

		getChildContext() {
			return {
				selector: this.selector
			}
		}

		render() {
			return React.createElement(this.componentClass, Object.assign(<TPropWrap>{},
				this.props, {
					selector: this.selector,
					parentSelector: this.parentSelector,
					dispatch: this.props.dispatch
				}))
		}

		static contextTypes = {
			selector: React.PropTypes.func
		}

		static childContextTypes = {
			selector: React.PropTypes.func
		}
	}

	return ComponentWrapper;
}

export function registerComponent<TPropEnd, TPropStart>(
	component: IComponentConfig<TPropEnd>,
	mapStateAndDispatchToProps?: IMapStateAndDispatchToProps<TPropEnd, TPropStart>,
	options?: any
) {
	if (!componentRegistry[component.group]) {
		componentRegistry[component.group] = {};
	}

	componentRegistry[component.group][component.name] =
		Object.assign(<IComponentSetup<TPropEnd, TPropStart>>{},
			component, {
				reducer: component.reducer || Identity,
				containerClassSupplier: connectComponent(component.viewClass, mapStateAndDispatchToProps, options)
			});
}

export function addComponentReducers(
	group: ComponentGroups,
	componentsStateSelector: (state: any) => IComponentStateMap,
	componentStateFactory: (newCompState: any) => any,
	componentsConfigMapSelector: (state: any) => IComponentConfigMap,
	otherReducers: (state: any, action: any) => any) {

	let componentReducer = (state: any, action: any) => {
		let prevCompState = componentsStateSelector(state) || {};
		let componentsConfig = componentsConfigMapSelector(state);


		let newCompState = createComponentsReducer(group, componentsConfig, state)(prevCompState, action);

		if (newCompState === prevCompState) {
			return state;
		}

		return {
			...state,
			...componentStateFactory(newCompState)
		}
	}

	return reduceReducers(otherReducers, componentReducer);
}

export function createComponentsReducer(
	componentGroup: ComponentGroups,
	componentsConfig: IComponentConfigMap,
	parentState: IComponentStateMap) {
	let reducers = Object.keys(componentsConfig).map((k: string) => {
		let config = componentsConfig[k];
		let defaultState = { config: config };
		let component = getComponentFromRegistry(componentGroup, config.type);


		return (componentsState: any, action: any): any => {
			let prevPartState = componentsState[k];
			let newPartState = component.reducer(prevPartState || defaultState, action, parentState);
			if (newPartState === prevPartState) {
				return componentsState;
			}
			return {
				...componentsState,
				[k]: newPartState
			};
		}
	});

	return reduceReducers(...reducers);
}

class ComponentTypeRegistry {
	[type: number]: {
		[name: string]: IComponentSetup<any, any>
	}
}

let componentRegistry = new ComponentTypeRegistry();


// -----------------------------------------------------------------------------------
//		Internal
// -----------------------------------------------------------------------------------

function connectComponent<TPropEnd, TPropStart>(
	componentClass: React.ComponentClass<TPropEnd>,
	mapStateAndDispatchToProps?: IMapStateAndDispatchToProps<TPropEnd, TPropStart>,
	options?: any
) {

	return (selector: ISelector<any, any>): React.ComponentClass<TPropStart> => {
		const reduxMapState = (state: any) => {
			return { state: state }
		}

		const reduxMapDispatch = (dispatch: Dispatch<any>) => {
			return { dispatch: dispatch }
		}

		const reduxMergeProps = (stateOut: any, dispatchOut: any, ownProps: TPropStart & ISelectorProp): TPropEnd =>
			// TODO: add local dispatch
			mapStateAndDispatchToProps(ownProps, ownProps.selector(stateOut.state), ownProps.parentSelector(stateOut.state), dispatchOut.dispatch, dispatchOut.dispatch);

		return reduxConnect(
			reduxMapState,
			reduxMapDispatch,
			reduxMergeProps,
			Object.assign({}, { pure: true }, options)
		)(componentClass)

	}
}

function getComponentFromRegistry(componentGroup: ComponentGroups, name: string) {
	let group = componentRegistry[componentGroup];
	if (!group) {
		throw Error('No components found in group: ' + componentGroup);
	}

	if (!group[name]) {
		throw Error(`Component "${name}" not found in group: ${componentGroup}`);
	}
	return group[name];
}

function mergeSelectors(parentSelector: ISelector<any, any>, childSelector: ISelector<any, any>) {
	return (state: any) =>
		childSelector(parentSelector(state))
}

function computeSelector(childSelector: ISelector<any, any>, ctx: any): ISelector<any, any> {
	return mergeSelectors(
		getParentSelector(ctx),
		childSelector ? childSelector : Identity
	)
}

function getParentSelector(ctx: any): ISelector<any, any> {
	return ctx.selector ? ctx.selector : Identity;
}

const Identity = (a: any) => a;

interface IComponentConfigMap {
	[name: string]: { type: string }
}
interface IComponentStateMap {
	[name: string]: {}
}

interface IComponentSupplier {
	(selector: ISelector<any, any>): React.ComponentClass<any>
}


interface IComponentSetup<TPropEnd, TPropStart> extends IComponentConfig<TPropEnd> {
	containerClassSupplier: IComponentSupplier
}

interface ISelectorSupplier<TProp, TStateEnd, TStateStart> {
	(props: TProp): ISelector<TStateEnd, TStateStart>
}

interface IComponentClassSupplier<TProp> {
	(props: TProp): React.ComponentClass<any>
}

interface IComponentProp<TStateEnd> {
	selector: ISelector<TStateEnd, any>
}

interface IDispatchProp {
	dispatch: Dispatch<any>
}

interface ISelectorProp {
	selector: ISelector<any, any>
	parentSelector: ISelector<any, any>
}

interface ISelector<TEnd, TStart> {
	(state: TStart): TEnd
}

interface ISelector2<TEnd, TProp> {
	(state: any, props: TProp): TEnd
}

interface IMapStateAndDispatchToProps<TPropEnd, TPropStart> {
	(ownProps: TPropStart, stateLocal: any, stateParent: any, dispatchLocal: Dispatch<any>, dispatchGlobal?: Dispatch<any>): TPropEnd;
}