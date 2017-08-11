import { Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentSetup, Dispatcher } from 'scripts/component-connect';
import { standardPageReducer } from './standardPage.reducer';
import { IStandardPageProp, StandardPage } from './standardPage.view';
import { IPageProp, IPageState } from 'components/page';
import { IPagePartState } from 'components/page-part';
import { StandardPageActions } from './standardPage.actions';



const componentConfig: IComponentSetup<IStandardPageProp, StandardPageActions.IDefinition> = {
	group: ComponentGroups.Page,
	name: 'StandardPage',
	reducer: standardPageReducer,
	actions: StandardPageActions.Default,
	viewClass: StandardPage
}

const mapStateToProps = (state: IPageState) => {
	return {
		parts: state.config.parts
	}
}

function mapDispatchToProps(dispatch: Dispatcher<any>, ownProps: IPageProp, actions: StandardPageActions.IDefinition) {
	return (topDispatch: Dispatcher<any>) => {
		return {
			onClearEntity: () => dispatch(actions.clearEntity()),
			onSelectEntity: (entityId: string) => dispatch(actions.selectEntity(entityId)),
			onUpdateEntity: (entity:any) => dispatch(actions.updateEntity(entity))
		}
	}
}

function mergeProps(a: any, b: any, c: any): IStandardPageProp {
	return { ...a, ...b, ...c } as IStandardPageProp;
}

registerComponent(
	componentConfig,
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)