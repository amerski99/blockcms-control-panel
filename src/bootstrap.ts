import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppRedux } from './components/app';

// get component registry
import './components/component.register';

ReactDOM.render(
	React.createElement(AppRedux),
	document.getElementById('main'));
