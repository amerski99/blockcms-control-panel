import { Dispatch } from 'redux';
import { IQueryDefinition } from './index';


export interface IQueryDefinition {
	id?: string
	typeFilter?: string
	filters?: Array<IQueryFilterConfig>
	include?: Array<string>
	sort?: Array<IQuerySortConfig>
	page?: number
	limit?: number
}

interface IQueryFilterConfig {
	field: string
	value: any
	operand?: OperandTypeCodes
}

interface IQuerySortConfig {
	field: string,
	sort?: SortTypeCodes
}

export enum SortTypeCodes {
	Ascending = 1,
	Descending = 2
}

export enum OperandTypeCodes {
	Equal = 1,
	NotEqual = 2,
	GreaterThanEqualTo = 3,
	LessThanEqualTo = 4,
	GreaterThan = 5,
	LessThan = 6,
	StartsWith = 7,
	Contains = 8,
	EndsWith = 9,
	Id = 10
}

// TODO: make dynamic
const AuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OGJkZGJmMzM4MDUwNTEyYWVkN2I0YzIiLCJqdGkiOiJkNDg5NzhjNy0yYzFlLTQ5YjEtYWRmNy0yYWM4NDgwODVhNDIiLCJpYXQiOjE0OTkxNTA5MTksIm5iZiI6MTQ5OTE1MDkxOSwiZXhwIjoxNDk5NzU1NzE5LCJpc3MiOiJwb3dlcnNjb3V0LWNtcyIsImF1ZCI6InBvd2Vyc2NvdXQtY21zIn0._j6SCX0jv1DhA5YyrO5EsqnbjAamuhWmS8TYHCPBlFs'
const BaseUrl = '/api/content/items'

export function queryEntities(query: IQueryDefinition): Promise<any> {
	let url = null;
	if (query.id) {
		console.log('id query', query.id);
		url = BaseUrl + '/' + encodeURIComponent(query.id);
	}
	if (query.typeFilter) {
		console.log('type query', query.typeFilter);
		url = BaseUrl + '/types/' + encodeURIComponent(query.typeFilter);
	}

	if (url) {
		return request(url);
	}

	// TODO: implement other query type
	return Promise.resolve();
}

export function insertEntity(data: Object) {
	console.log('insert entity',  data);

	return request(BaseUrl, 'POST', data);
}

export function updateEntity(id: string, data: Object): Promise<any> {
	console.log('update entity.  id: ', id, data);

	let url = BaseUrl + '/' + encodeURIComponent(id);

	return request(url, 'PUT', data);
}

export function deleteEntity(id: string): Promise<any> {
	console.log('remove entity.  id: ', id);

	let url = BaseUrl + '/' + encodeURIComponent(id);

	return request(url, 'DELETE');
}

function request(url: string, method: string = 'GET', data: any = null): Promise<any> {
	let request = createRequest(method, data);
	return fetch(url, request)
		.then(json);
}

function createRequest(method: string, data: any): RequestInit {
	let request = <RequestInit>{
		method: method,
		headers: new Headers({
			'X-CMS-SiteId': 'powerscout',
			'X-CMS-CaseSetting': 'camel',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + AuthToken
		})
	};

	if (method == 'POST' || method == 'PUT') {
		if (data) request.body = JSON.stringify(data);
      	request.headers.append('Content-Type', 'application/json');
	}

	return request;
}

function json(response: Response) {
	return response.json();
} 