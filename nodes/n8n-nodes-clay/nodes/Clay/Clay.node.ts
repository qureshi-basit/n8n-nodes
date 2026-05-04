import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestOptions,
    IDataObject,
} from 'n8n-workflow';

export class Clay implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Clay',
        name: 'clay',
        icon: 'file:clay.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
        description: 'Interact with Clay API for data enrichment and lead generation',
        defaults: { name: 'Clay' },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [{ name: 'clayApi', required: true }],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Table', value: 'table' },
                    { name: 'Row', value: 'row' },
                    { name: 'Enrichment', value: 'enrichment' },
                ],
                default: 'table',
            },
            // Table operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['table'] } },
                options: [
                    { name: 'List Tables', value: 'listTables', description: 'Get all tables' },
                    { name: 'Get Table', value: 'getTable', description: 'Get a specific table' },
                    { name: 'Create Table', value: 'createTable', description: 'Create a new table' },
                    { name: 'Update Table', value: 'updateTable', description: 'Update an existing table' },
                ],
                default: 'listTables',
            },
            // Row operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['row'] } },
                options: [
                    { name: 'List Rows', value: 'listRows', description: 'Get rows from a table' },
                    { name: 'Get Row', value: 'getRow', description: 'Get a specific row' },
                    { name: 'Create Row', value: 'createRow', description: 'Create a new row' },
                    { name: 'Update Row', value: 'updateRow', description: 'Update an existing row' },
                    { name: 'Delete Row', value: 'deleteRow', description: 'Delete a row' },
                ],
                default: 'listRows',
            },
            // Enrichment operations
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['enrichment'] } },
                options: [
                    { name: 'Enrich Person', value: 'enrichPerson', description: 'Enrich person data' },
                    { name: 'Enrich Company', value: 'enrichCompany', description: 'Enrich company data' },
                    { name: 'Find Email', value: 'findEmail', description: 'Find email address' },
                    { name: 'Verify Email', value: 'verifyEmail', description: 'Verify email address' },
                ],
                default: 'enrichPerson',
            },
            // Table ID field (for operations that need it)
            {
                displayName: 'Table ID',
                name: 'tableId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['getTable', 'updateTable', 'listRows', 'createRow'],
                    },
                },
                default: '',
                description: 'The ID of the table',
            },
            // Row ID field
            {
                displayName: 'Row ID',
                name: 'rowId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['getRow', 'updateRow', 'deleteRow'],
                    },
                },
                default: '',
                description: 'The ID of the row',
            },
            // Table name for creation
            {
                displayName: 'Table Name',
                name: 'tableName',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['createTable', 'updateTable'],
                    },
                },
                default: '',
                description: 'Name of the table',
            },
            // Row data for creation/update
            {
                displayName: 'Row Data',
                name: 'rowData',
                type: 'fixedCollection',
                typeOptions: { multipleValues: true },
                displayOptions: {
                    show: {
                        operation: ['createRow', 'updateRow'],
                    },
                },
                default: {},
                options: [
                    {
                        name: 'fields',
                        displayName: 'Fields',
                        values: [
                            {
                                displayName: 'Field Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Field Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
                description: 'Data for the row',
            },
            // Person data for enrichment
            {
                displayName: 'Person Data',
                name: 'personData',
                type: 'collection',
                displayOptions: {
                    show: {
                        operation: ['enrichPerson'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'First Name',
                        name: 'firstName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Email',
                        name: 'email',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Company',
                        name: 'company',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'LinkedIn URL',
                        name: 'linkedinUrl',
                        type: 'string',
                        default: '',
                    },
                ],
                description: 'Person information to enrich',
            },
            // Company data for enrichment
            {
                displayName: 'Company Data',
                name: 'companyData',
                type: 'collection',
                displayOptions: {
                    show: {
                        operation: ['enrichCompany'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'Company Name',
                        name: 'companyName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Domain',
                        name: 'domain',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'LinkedIn URL',
                        name: 'linkedinUrl',
                        type: 'string',
                        default: '',
                    },
                ],
                description: 'Company information to enrich',
            },
            // Email for find/verify operations
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['verifyEmail'],
                    },
                },
                default: '',
                description: 'Email address to verify',
            },
            // Email search parameters
            {
                displayName: 'Search Parameters',
                name: 'searchParams',
                type: 'collection',
                displayOptions: {
                    show: {
                        operation: ['findEmail'],
                    },
                },
                default: {},
                options: [
                    {
                        displayName: 'First Name',
                        name: 'firstName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Last Name',
                        name: 'lastName',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Company Domain',
                        name: 'domain',
                        type: 'string',
                        default: '',
                    },
                ],
                description: 'Parameters for finding email',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i) as string;
                const operation = this.getNodeParameter('operation', i) as string;
                let responseData: any;

                if (resource === 'table') {
                    if (operation === 'listTables') {
                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: 'https://api.clay.com/v1/tables',
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'getTable') {
                        const tableId = this.getNodeParameter('tableId', i) as string;
                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `https://api.clay.com/v1/tables/${tableId}`,
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'createTable') {
                        const tableName = this.getNodeParameter('tableName', i) as string;
                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: 'https://api.clay.com/v1/tables',
                            body: { name: tableName },
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'updateTable') {
                        const tableId = this.getNodeParameter('tableId', i) as string;
                        const tableName = this.getNodeParameter('tableName', i) as string;
                        const options: IHttpRequestOptions = {
                            method: 'PUT',
                            url: `https://api.clay.com/v1/tables/${tableId}`,
                            body: { name: tableName },
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    }
                } else if (resource === 'row') {
                    if (operation === 'listRows') {
                        const tableId = this.getNodeParameter('tableId', i) as string;
                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `https://api.clay.com/v1/tables/${tableId}/rows`,
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'getRow') {
                        const rowId = this.getNodeParameter('rowId', i) as string;
                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `https://api.clay.com/v1/rows/${rowId}`,
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'createRow') {
                        const tableId = this.getNodeParameter('tableId', i) as string;
                        const rowData = this.getNodeParameter('rowData', i) as IDataObject;
                        
                        const fields: IDataObject = {};
                        if (rowData.fields && Array.isArray(rowData.fields)) {
                            for (const field of rowData.fields as IDataObject[]) {
                                if (field.name && field.value !== undefined) {
                                    fields[field.name as string] = field.value;
                                }
                            }
                        }

                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: `https://api.clay.com/v1/tables/${tableId}/rows`,
                            body: { fields },
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'updateRow') {
                        const rowId = this.getNodeParameter('rowId', i) as string;
                        const rowData = this.getNodeParameter('rowData', i) as IDataObject;
                        
                        const fields: IDataObject = {};
                        if (rowData.fields && Array.isArray(rowData.fields)) {
                            for (const field of rowData.fields as IDataObject[]) {
                                if (field.name && field.value !== undefined) {
                                    fields[field.name as string] = field.value;
                                }
                            }
                        }

                        const options: IHttpRequestOptions = {
                            method: 'PUT',
                            url: `https://api.clay.com/v1/rows/${rowId}`,
                            body: { fields },
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'deleteRow') {
                        const rowId = this.getNodeParameter('rowId', i) as string;
                        const options: IHttpRequestOptions = {
                            method: 'DELETE',
                            url: `https://api.clay.com/v1/rows/${rowId}`,
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    }
                } else if (resource === 'enrichment') {
                    if (operation === 'enrichPerson') {
                        const personData = this.getNodeParameter('personData', i) as IDataObject;
                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: 'https://api.clay.com/v1/enrichment/person',
                            body: personData,
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'enrichCompany') {
                        const companyData = this.getNodeParameter('companyData', i) as IDataObject;
                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: 'https://api.clay.com/v1/enrichment/company',
                            body: companyData,
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'findEmail') {
                        const searchParams = this.getNodeParameter('searchParams', i) as IDataObject;
                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: 'https://api.clay.com/v1/enrichment/email/find',
                            body: searchParams,
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    } else if (operation === 'verifyEmail') {
                        const email = this.getNodeParameter('email', i) as string;
                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: 'https://api.clay.com/v1/enrichment/email/verify',
                            body: { email },
                            json: true,
                        };
                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'clayApi',
                            options,
                        );
                    }
                }

                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(responseData as INodeExecutionData[]),
                    { itemData: { item: i } },
                );
                returnData.push(...executionData);
            } catch (error: unknown) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error instanceof Error ? error.message : String(error) } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
