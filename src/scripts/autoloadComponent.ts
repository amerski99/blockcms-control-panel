import * as React from 'react';

export interface IAutoLoadComponentProp {
	onLoad():void
}

export class AutoLoadComponent<T extends IAutoLoadComponentProp> extends React.Component<T, {}> {
	constructor(props: T, ctx: any) {
		super(props, ctx);

	}
	componentWillMount() {
		this.props.onLoad();
	}

	componentWillReceiveProps(nextProps: Readonly<T>, nextContext: any) {
		nextProps.onLoad();
	}
}