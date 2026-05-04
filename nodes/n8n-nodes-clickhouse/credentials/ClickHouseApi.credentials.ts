import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClickHouseApi implements ICredentialType {
	name = 'clickHouseApi';
	displayName = 'ClickHouse API';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'localhost',
		},
		{
		},
		{
		},
		{
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Database',
			name: 'database',
			type: 'string',
		  default: '',

		}
,
		{
		},
	];

	authenticate: IAuthenticateGeneric = {
        type: 'generic',
		properties: {
			headers: {
				'X-ClickHouse-User': '={{$credentials.username}}',
				'X-ClickHouse-Key': '={{$credentials.password}}',
				'X-ClickHouse-Database': '={{$credentials.database}}',
			},
		},
	};
}
