import * as React from 'react';
import { IFormItemComponentProp } from 'components/form-item/formItem.container';
import { AutoLoadComponent } from "scripts/autoloadComponent";


export class EmptyView extends AutoLoadComponent<IFormItemComponentProp> {
	constructor(props: IFormItemComponentProp, ctx: any) {
		super(props, ctx);
	}

	render(): JSX.Element {
		return <div><input type='hidden' value={this.props.value||''} /></div>;
	}
}