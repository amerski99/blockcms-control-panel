import { Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentConfig } from 'scripts/component-connect';
import { IPageProp, IPageState } from 'components/page';
import { IFormState } from 'components/form';
import { IFormItemComponentProp, IFormItemProp, IFormItemState, IFormItemConfig } from 'components/form-item';
import { FormItemSharedActions } from '../actions/shared.action';
import { EmptyView } from '../views/empty.view';
import { simpleStringReducer } from '../reducers/simpleString.reducer';


interface IIFormItemStaticValueConfig extends IFormItemConfig {
	value: any
}

export type IFormItemStaticValueConfig = IIFormItemStaticValueConfig & { type: 'Static' };

const componentConfig: IComponentConfig<IFormItemComponentProp> = {
	group: ComponentGroups.FormItem,
	name: 'Static',
	reducer: simpleStringReducer,
	viewClass: EmptyView
}

const mapStateToProps = (ownProps: IFormItemProp, stateLocal: IFormItemState, stateParent: IFormState, dispatchLocal: Dispatch<any>, dispatchParent: Dispatch<any>): IFormItemComponentProp => {
	const config = ownProps.config as IFormItemStaticValueConfig;
	const staticValue = config.value;
	const origWriteValue = stateParent.currentEntity.origWriteData[ownProps.name];
	const name = ownProps.name;

	return {
		value: staticValue,
		onLoad: () => dispatchParent(FormItemSharedActions.load(name, staticValue, origWriteValue, stateLocal))
	}
}


registerComponent(
	componentConfig,
	mapStateToProps
)