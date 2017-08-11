import * as React from 'react';
import { createStore } from 'redux';
import { connect, Dispatch } from 'react-redux';

import { ComponentGroups, wrapComponent, IComponentWrapProps } from 'scripts/component-connect';
import { IAppState } from 'components/app';
import { IPageConfig } from './page.config';
import { IPageState } from './page.state';

export interface IPageProp extends IComponentWrapProps {
}

const Page = wrapComponent(
	ComponentGroups.Page,
    (ownProps: IPageProp) => (state: IAppState): IPageState =>  {
		return state.pages[ownProps.name];
	}
) as React.ComponentClass<IPageProp>

export { Page }