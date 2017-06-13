import { Dispatch } from 'redux';

import { registerComponent, ComponentGroups, IComponentConfig } from 'scripts/component-connect';
import { standardPageReducer } from './standardPage.reducer';
import { IStandardPageProp, StandardPage } from './standardPage.view';
import { IPageProp, IPageState } from 'components/page';
import { IPagePartState } from 'components/page-part';



const componentConfig: IComponentConfig<IStandardPageProp> = {
	group: ComponentGroups.Page,
	name: 'StandardPage',
	reducer: standardPageReducer,
	viewClass: StandardPage
}

const mapStateToProps = (ownProps: IPageProp, stateLocal: IPageState): IStandardPageProp => {
	return {
		parts: stateLocal.config.parts
	}
}

registerComponent(
	componentConfig,
	mapStateToProps
)