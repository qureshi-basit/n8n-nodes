import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestOptions,
    IDataObject,
} from 'n8n-workflow';

export class PowerBI implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Power BI',
        name: 'powerBI',
        icon: 'file:powerBI.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{"$parameter[\"operation\"]"}}',
        description: 'Interact with Power BI API to query models and generate insights',
        defaults: { name: 'Power BI' },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [{ name: 'powerBIApi', required: true }],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Get Workspaces',
                        value: 'getWorkspaces',
                        description: 'Retrieve all Power BI workspaces',
                        action: 'Get workspaces',
                    },
                    {
                        name: 'Get Datasets',
                        value: 'getDatasets',
                        description: 'Retrieve datasets from a workspace',
                        action: 'Get datasets',
                    },
                    {
                        name: 'Execute DAX Query',
                        value: 'executeDax',
                        description: 'Execute DAX query on a dataset for insights',
                        action: 'Execute DAX query',
                    },
                    {
                        name: 'Get Reports',
                        value: 'getReports',
                        description: 'Retrieve reports from a workspace',
                        action: 'Get reports',
                    },
                    {
                        name: 'Get Dashboards',
                        value: 'getDashboards',
                        description: 'Retrieve dashboards from a workspace',
                        action: 'Get dashboards',
                    },
                    {
                        name: 'Refresh Dataset',
                        value: 'refreshDataset',
                        description: 'Trigger a dataset refresh',
                        action: 'Refresh dataset',
                    },
                ],
                default: 'getWorkspaces',
            },
            {
                displayName: 'Workspace ID',
                name: 'workspaceId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['getDatasets', 'executeDax', 'getReports', 'getDashboards', 'refreshDataset'],
                    },
                },
                default: '',
                required: true,
                description: 'The ID of the Power BI workspace',
            },
            {
                displayName: 'Dataset ID',
                name: 'datasetId',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['executeDax', 'refreshDataset'],
                    },
                },
                default: '',
                required: true,
                description: 'The ID of the Power BI dataset',
            },
            {
                displayName: 'DAX Query',
                name: 'daxQuery',
                type: 'string',
                typeOptions: {
                    rows: 5,
                },
                displayOptions: {
                    show: {
                        operation: ['executeDax'],
                    },
                },
                default: 'EVALUATE TOPN(10, VALUES(\'Table\'[Column]))',
                required: true,
                description: 'The DAX query to execute for generating insights',
            },
            {
                displayName: 'Include Schema',
                name: 'includeSchema',
                type: 'boolean',
                displayOptions: {
                    show: {
                        operation: ['executeDax'],
                    },
                },
                default: false,
                description: 'Whether to include column schema information in the response',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i) as string;
                let responseData: IDataObject | IDataObject[];

                if (operation === 'getWorkspaces') {
                    const options: IHttpRequestOptions = {
                        method: 'GET',
                        url: 'https://api.powerbi.com/v1.0/myorg/groups',
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'powerBIApi',
                        options,
                    );
                } else if (operation === 'getDatasets') {
                    const workspaceId = this.getNodeParameter('workspaceId', i) as string;
                    
                    const options: IHttpRequestOptions = {
                        method: 'GET',
                        url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets`,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'powerBIApi',
                        options,
                    );
                } else if (operation === 'executeDax') {
                    const workspaceId = this.getNodeParameter('workspaceId', i) as string;
                    const datasetId = this.getNodeParameter('datasetId', i) as string;
                    const daxQuery = this.getNodeParameter('daxQuery', i) as string;
                    const includeSchema = this.getNodeParameter('includeSchema', i) as boolean;

                    const body: IDataObject = {
                        queries: [
                            {
                                query: daxQuery,
                            },
                        ],
                    };

                    if (includeSchema) {
                        body.serializerSettings = {
                            includeNulls: true,
                        };
                    }

                    const options: IHttpRequestOptions = {
                        method: 'POST',
                        url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/executeQueries`,
                        body,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'powerBIApi',
                        options,
                    );
                } else if (operation === 'getReports') {
                    const workspaceId = this.getNodeParameter('workspaceId', i) as string;
                    
                    const options: IHttpRequestOptions = {
                        method: 'GET',
                        url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'powerBIApi',
                        options,
                    );
                } else if (operation === 'getDashboards') {
                    const workspaceId = this.getNodeParameter('workspaceId', i) as string;
                    
                    const options: IHttpRequestOptions = {
                        method: 'GET',
                        url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/dashboards`,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'powerBIApi',
                        options,
                    );
                } else if (operation === 'refreshDataset') {
                    const workspaceId = this.getNodeParameter('workspaceId', i) as string;
                    const datasetId = this.getNodeParameter('datasetId', i) as string;
                    
                    const options: IHttpRequestOptions = {
                        method: 'POST',
                        url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/refreshes`,
                        body: {
                            notifyOption: 'MailOnCompletion',
                        },
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'powerBIApi',
                        options,
                    );

                    // For refresh operations, create a success response
                    responseData = {
                        success: true,
                        message: 'Dataset refresh initiated successfully',
                        workspaceId,
                        datasetId,
                    };
                }

                let dataToReturn: IDataObject[];
                if (Array.isArray(responseData)) {
                    dataToReturn = responseData;
                } else if (responseData && typeof responseData === 'object' && 'value' in responseData) {
                    dataToReturn = (responseData.value as IDataObject[]) || [];
                } else {
                    dataToReturn = [responseData as IDataObject];
                }

                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(dataToReturn),
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
