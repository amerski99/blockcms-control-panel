import * as React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { reduceReducers } from 'scripts/util';
import { forwardDispatchTo } from "scripts/component-connect/middleware";

export enum ComponentGroups {
	Global,
	Page,
	PagePart,
	ListView,
	FormItem
}


export interface IComponentSetup<TPropEnd, TAction> {
	group: ComponentGroups
	name: string
	viewClass: React.ComponentClass<TPropEnd>
	defaultConfig?: any,
	actions?: TAction,
	reducer?(state: any, action: any, parentState: any): any
}

export interface IComponentConfig {
	type: string
}

export interface IComponentWrapProps {
	name: string,
	config: IComponentConfig
}

export function wrapComponent<TStateStart, TStateEnd, TProps extends IComponentWrapProps>(
	componentGroup: ComponentGroups,
	selectorSupplier: ISelectorSupplier<TProps, TStateEnd, TStateStart>
): React.ComponentClass<TProps> {
	let componentSetupSupplier = (props: TProps) => getComponentFromRegistry(componentGroup, props.config.type);


	class ComponentWrapper extends React.Component<TProps, {}> {
		componentClass: React.ComponentClass<TProps>
		selector: ISelector<TStateEnd, any>
		componentNames: Array<string>

		constructor(props: TProps, ctx: any) {
			super(props, ctx)
			// get component setup for this compenent (comes from component group and type on the properties)
			let componentSetup = componentSetupSupplier(props);

			// get component selector from props (this maps from parent state to this component's state)
			let selector = selectorSupplier(props);

			this.componentClass = componentSetup.containerClass;
			this.selector = computeSelector(selector, ctx);
			this.componentNames = (ctx.componentNames as Array<string> || []).concat(props.name)
		}

		getChildContext() {
			return {
				selector: this.selector,
				componentNames: this.componentNames
			}
		}

		render() {
			return React.createElement(this.componentClass, Object.assign(<TProps>{},
				this.props, {
					selector: this.selector,
					componentNames: this.componentNames
				}))
		}

		static contextTypes = {
			selector: React.PropTypes.func,
			componentNames: React.PropTypes.array
		}

		static childContextTypes = {
			selector: React.PropTypes.func,
			componentNames: React.PropTypes.array
		}
	}

	return ComponentWrapper;
}

function defaultMapDispatchToProps(): any {
	return {};
}

export function registerComponent<TPropEnd, TPropStart, TStateProps, TDispatchProps, TActions>(
	component: IComponentSetup<TPropEnd, TActions>,
    mapStateToProps: MapStateToPropsParam<TStateProps, TPropStart>,
    mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TPropStart, TActions> = defaultMapDispatchToProps,
    mergeProps: MergeProps<TStateProps, TDispatchProps, TPropStart, TPropEnd> = defaultMergeProps,
	options: any = {}
) {
	if (!componentRegistry[component.group]) {
		componentRegistry[component.group] = {};
	}

	componentRegistry[component.group][component.name] =
		Object.assign(<IComponentSetup<TPropEnd, TPropStart>>{},
			component, {
				reducer: component.reducer || Identity,
				containerClass: connectComponent(
						component.viewClass,
						component.actions,
						mapStateToProps, 
						mapDispatchToProps, 
						mergeProps, 
						options
					)
			});
}

export function addComponentReducers(
	group: ComponentGroups,
	componentsStateSelector: (state: any) => IComponentStateMap,
	componentStateFactory: (newCompState: any) => any,
	componentsConfigMapSelector: (state: any) => IComponentConfigMap,
	otherReducers: (state: any, action: any) => any = Identity) {

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

	let reducers = Object.keys(componentsConfig).map((name: string) => {
		let config = componentsConfig[name];
		let componentLevel = (parentState.componentLevel || 0) as number + 1;
		let defaultState = { 
			name: name, 
			config: config, 
			componentLevel
		};
		let component = getComponentFromRegistry(componentGroup, config.type);


		return (componentsState: any, action: any): any => {
			let postCalculate = Identity;
			let actionComponents = action.meta && action.meta.componentNames ||[];
			let appliesToMe = !actionComponents.length
								|| actionComponents.length < componentLevel 
								|| actionComponents[componentLevel-1] == name;

			if (appliesToMe) {	
				//console.log('applies to me...', action.type, name, componentLevel);

				let prevPartState = componentsState[name];
				let newPartState = component.reducer(prevPartState || defaultState, action, parentState);
				
				if (newPartState !== prevPartState) {
				//	console.log('...changed');
					return {
						...componentsState,
						[name]: newPartState
					};
				}
			}
			else {
			//	console.log('NOT me...', action.type, name, componentLevel);
			}

			return componentsState;
		}
	});

	return reduceReducers(...reducers);
}

export type DispatchActionFactory<R, S> = (dispatch: Dispatch<any>, getState: () => S) => R;

export type DispatchAction<R, S> = DispatchActionFactory<R, S> | Action

export interface Dispatcher<S> {
	<R>(action: DispatchAction<R,S>): R;
}

class ComponentTypeRegistry {
	[type: number]: {
		[name: string]: IComponentFullSetup<any, any>
	}
}

let componentRegistry = new ComponentTypeRegistry();


// -----------------------------------------------------------------------------------
//		Internal
// -----------------------------------------------------------------------------------


function connectComponent<TPropEnd, TPropStart, TStateProps, TDispatchProps, TActions>(
	componentClass: React.ComponentClass<TPropEnd>,
	actions: TActions,
    mapStateToProps: MapStateToPropsParam<TStateProps, TPropStart>,
    mapDispatchToProps: MapDispatchToPropsParam<TDispatchProps, TPropStart, TActions>,
    mergeProps: MergeProps<TStateProps, TDispatchProps, TPropStart, TPropEnd>,
	options?: any
) {

	type TPropWrap = TPropStart & IComponentProps;
	
	const finalMapStateToProps = (state: any, ownProps?: TPropWrap) => {
		return mapStateToProps(ownProps.selector(state), ownProps); 
	}

	let finalMapDispatchToProps = (dispatch: Dispatch<any>, ownProps?: TPropWrap) => {
		let forwardDispatch = forwardDispatchTo(dispatch, ownProps.selector, ownProps.componentNames);
		return mapDispatchToProps(forwardDispatch, ownProps, actions);
	}

	return reduxConnect<TStateProps, TDispatchProps, TPropStart, TPropEnd>(
		finalMapStateToProps as MapStateToPropsParam<TStateProps, TPropStart>,
		finalMapDispatchToProps as MapDispatchToPropsParam<TDispatchProps, TPropStart, TActions>,
		mergeProps,
		Object.assign({}, { pure: true }, options)
	)(componentClass)

}

function getComponentFromRegistry(componentGroup: ComponentGroups, name: string) {
	let group = componentRegistry[componentGroup];
	let groupName = ComponentGroups[componentGroup].toString();

	if (!group) {
		throw Error(`No components found in group: ${groupName}`);
	}

	if (!group[name]) {
		throw Error(`Component "${name}" not found in group: ${groupName}`);
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
	[name: string]: IComponentConfig
}

interface IComponentStateMap {
	[name: string]: {}
}


interface IComponentFullSetup<TPropEnd, TActions> extends IComponentSetup<TPropEnd, TActions> {
	containerClass: React.ComponentClass<any>
}

interface ISelectorSupplier<TProp, TStateEnd, TStateStart> {
	(props: TProp): ISelector<TStateEnd, TStateStart>
}

interface IComponentProps {
	selector: ISelector<any, any>
	componentNames: Array<string>
}

interface IDispatchProp {
	dispatch: Dispatch<any>
}

interface ISelectorProp {
	selector: ISelector<any, any>
	parentSelector: ISelector<any, any>
}

export interface ISelector<TEnd, TStart> {
	(state: TStart): TEnd
}

interface ISelector2<TEnd, TProp> {
	(state: any, props: TProp): TEnd
}

interface MapStateToProps<TStateProps, TOwnProps> {
    (state: any, ownProps?: TOwnProps): TStateProps;
}

interface MapStateToPropsFactory<TStateProps, TOwnProps> {
    (initialState: any, ownProps?: TOwnProps): MapStateToProps<TStateProps, TOwnProps>;
}

type MapStateToPropsParam<TStateProps, TOwnProps> = MapStateToProps<TStateProps, TOwnProps> | MapStateToPropsFactory<TStateProps, TOwnProps>;
type MapStateToPropsOut<TStateProps, TOwnProps> =  MapStateToProps<TStateProps, TOwnProps> | TStateProps

interface MapDispatchToPropsFunction<TDispatchProps, TOwnProps, TActions> {
    (dispatch: Dispatch<any>, ownProps?: TOwnProps, actions?: TActions): TDispatchProps;
}


type MapDispatchToProps<TDispatchProps, TOwnProps, TActions> =
    MapDispatchToPropsFunction<TDispatchProps, TOwnProps, TActions>;

interface MapDispatchToPropsFactory<TDispatchProps, TOwnProps, TActions> {
    (dispatch: Dispatch<any>, ownProps?: TOwnProps, actions?: TActions): MapDispatchToProps<TDispatchProps, TOwnProps, TActions>;
}

type MapDispatchToPropsParam<TDispatchProps, TOwnProps, TActions> = MapDispatchToProps<TDispatchProps, TOwnProps, TActions> | MapDispatchToPropsFactory<TDispatchProps, TOwnProps, TActions>;

interface MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps> {
    (stateProps: TStateProps, dispatchProps: TDispatchProps, ownProps: TOwnProps): TMergedProps;
}

export function defaultMergeProps(stateProps: any, dispatchProps: any, ownProps: any): any {
  return { ...ownProps, ...stateProps, ...dispatchProps }
}
