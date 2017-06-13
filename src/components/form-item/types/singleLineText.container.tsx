import { Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentConfig } from 'scripts/component-connect';
import { IPageProp, IPageState } from 'components/page';
import { IFormState } from 'components/form';
import { IFormItemProp, IFormItemState } from 'components/form-item';
import { FormItemSharedActions } from '../actions/shared.action';
import { IStandardInputProp, StandardInput } from '../views/standardInput.view';
import { simpleStringReducer } from '../reducers/simpleString.reducer';



const componentConfig: IComponentConfig<IStandardInputProp> = {
	group: ComponentGroups.FormItem,
	name: 'SingleLineText',
	viewClass: StandardInput
}

const mapStateToProps = (ownProps: IFormItemProp, stateLocal: IFormItemState, stateParent: IFormState, dispatchLocal: Dispatch<any>, dispatchParent: Dispatch<any>): IStandardInputProp => {
	const readValue = stateParent.currentEntity.readData[ownProps.name];
	const writeValue = stateParent.currentEntity.writeData[ownProps.name];
	const origWriteValue = stateParent.currentEntity.origWriteData[ownProps.name];
	const name = ownProps.name;

	return {
		label: ownProps.config.label,
		inputType: 'text',
		value: writeValue,
		onLoad: () => dispatchParent(FormItemSharedActions.load(name, readValue, origWriteValue, stateLocal)),
		onUpdate: (value: string) => dispatchParent(FormItemSharedActions.update(name, value, origWriteValue, stateLocal))
	}
}


registerComponent(
	componentConfig,
	mapStateToProps
)