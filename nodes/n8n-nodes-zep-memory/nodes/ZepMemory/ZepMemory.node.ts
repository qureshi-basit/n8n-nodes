import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestOptions,
    IDataObject,
} from 'n8n-workflow';

export class ZepMemory implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Zep Memory',
        name: 'zepMemory',
        icon: 'file:zepMemory.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{"$parameter[\"operation\"]"}}',
        description: 'Interact with Zep Memory API for AI conversation memory management',
        defaults: { name: 'Zep Memory' },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [{ name: 'zepMemoryApi', required: true }],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Session',
                        value: 'session',
                    },
                    {
                        name: 'Memory',
                        value: 'memory',
                    },
                    {
                        name: 'Message',
                        value: 'message',
                    },
                ],
                default: 'session',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['session'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new session',
                        action: 'Create a session',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete a session',
                        action: 'Delete a session',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get session details',
                        action: 'Get a session',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'List all sessions',
                        action: 'List all sessions',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update a session',
                        action: 'Update a session',
                    },
                ],
                default: 'create',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['memory'],
                    },
                },
                options: [
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get memory for a session',
                        action: 'Get memory',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete memory for a session',
                        action: 'Delete memory',
                    },
                ],
                default: 'get',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['message'],
                    },
                },
                options: [
                    {
                        name: 'Add',
                        value: 'add',
                        description: 'Add messages to a session',
                        action: 'Add messages',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get messages from a session',
                        action: 'Get messages',
                    },
                    {
                        name: 'Search',
                        value: 'search',
                        description: 'Search messages in a session',
                        action: 'Search messages',
                    },
                ],
                default: 'add',
            },
            // Session ID field - shown for all operations except session list
            {
                displayName: 'Session ID',
                name: 'sessionId',
                type: 'string',
                required: true,
                displayOptions: {
                    hide: {
                        resource: ['session'],
                        operation: ['list'],
                    },
                },
                default: '',
                description: 'The unique identifier for the session',
            },
            // Session create/update fields
            {
                displayName: 'User ID',
                name: 'userId',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['session'],
                        operation: ['create', 'update'],
                    },
                },
                default: '',
                description: 'User ID associated with the session',
            },
            {
                displayName: 'Metadata',
                name: 'metadata',
                type: 'fixedCollection',
                displayOptions: {
                    show: {
                        resource: ['session'],
                        operation: ['create', 'update'],
                    },
                },
                typeOptions: {
                    multipleValues: true,
                },
                default: {},
                options: [
                    {
                        name: 'metadataValues',
                        displayName: 'Metadata',
                        values: [
                            {
                                displayName: 'Key',
                                name: 'key',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
            },
            // Message add fields
            {
                displayName: 'Messages',
                name: 'messages',
                type: 'fixedCollection',
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operation: ['add'],
                    },
                },
                typeOptions: {
                    multipleValues: true,
                },
                default: {},
                options: [
                    {
                        name: 'messageValues',
                        displayName: 'Message',
                        values: [
                            {
                                displayName: 'Role',
                                name: 'role',
                                type: 'options',
                                options: [
                                    {
                                        name: 'User',
                                        value: 'user',
                                    },
                                    {
                                        name: 'Assistant',
                                        value: 'assistant',
                                    },
                                    {
                                        name: 'System',
                                        value: 'system',
                                    },
                                ],
                                default: 'user',
                            },
                            {
                                displayName: 'Content',
                                name: 'content',
                                type: 'string',
                                typeOptions: {
                                    rows: 3,
                                },
                                default: '',
                            },
                        ],
                    },
                ],
            },
            // Message get/search fields
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operation: ['get'],
                    },
                },
                default: 10,
                description: 'Number of messages to retrieve',
            },
            {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operation: ['search'],
                    },
                },
                default: '',
                description: 'Search query for messages',
            },
            {
                displayName: 'Search Limit',
                name: 'searchLimit',
                type: 'number',
                displayOptions: {
                    show: {
                        resource: ['message'],
                        operation: ['search'],
                    },
                },
                default: 10,
                description: 'Number of search results to return',
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
                let responseData: IDataObject | IDataObject[];

                if (resource === 'session') {
                    if (operation === 'create') {
                        const sessionId = this.getNodeParameter('sessionId', i) as string;
                        const userId = this.getNodeParameter('userId', i) as string;
                        const metadataValues = this.getNodeParameter('metadata.metadataValues', i, []) as Array<{key: string; value: string}>;
                        
                        const metadata: IDataObject = {};
                        metadataValues.forEach((item) => {
                            metadata[item.key] = item.value;
                        });

                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: `/sessions/${sessionId}`,
                            body: {
                                user_id: userId,
                                metadata: metadata,
                            },
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    } else if (operation === 'get') {
                        const sessionId = this.getNodeParameter('sessionId', i) as string;

                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `/sessions/${sessionId}`,
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    } else if (operation === 'update') {
                        const sessionId = this.getNodeParameter('sessionId', i) as string;
                        const userId = this.getNodeParameter('userId', i) as string;
                        const metadataValues = this.getNodeParameter('metadata.metadataValues', i, []) as Array<{key: string; value: string}>;
                        
                        const metadata: IDataObject = {};
                        metadataValues.forEach((item) => {
                            metadata[item.key] = item.value;
                        });

                        const options: IHttpRequestOptions = {
                            method: 'PATCH',
                            url: `/sessions/${sessionId}`,
                            body: {
                                user_id: userId,
                                metadata: metadata,
                            },
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    } else if (operation === 'delete') {
                        const sessionId = this.getNodeParameter('sessionId', i) as string;

                        const options: IHttpRequestOptions = {
                            method: 'DELETE',
                            url: `/sessions/${sessionId}`,
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    } else if (operation === 'list') {
                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: '/sessions',
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    }
                } else if (resource === 'memory') {
                    const sessionId = this.getNodeParameter('sessionId', i) as string;

                    if (operation === 'get') {
                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `/sessions/${sessionId}/memory`,
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    } else if (operation === 'delete') {
                        const options: IHttpRequestOptions = {
                            method: 'DELETE',
                            url: `/sessions/${sessionId}/memory`,
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    }
                } else if (resource === 'message') {
                    const sessionId = this.getNodeParameter('sessionId', i) as string;

                    if (operation === 'add') {
                        const messageValues = this.getNodeParameter('messages.messageValues', i, []) as Array<{role: string; content: string}>;
                        
                        const messages = messageValues.map((msg) => ({
                            role: msg.role,
                            content: msg.content,
                        }));

                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: `/sessions/${sessionId}/messages`,
                            body: {
                                messages: messages,
                            },
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    } else if (operation === 'get') {
                        const limit = this.getNodeParameter('limit', i) as number;

                        const options: IHttpRequestOptions = {
                            method: 'GET',
                            url: `/sessions/${sessionId}/messages`,
                            qs: {
                                limit: limit,
                            },
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    } else if (operation === 'search') {
                        const query = this.getNodeParameter('query', i) as string;
                        const searchLimit = this.getNodeParameter('searchLimit', i) as number;

                        const options: IHttpRequestOptions = {
                            method: 'POST',
                            url: `/sessions/${sessionId}/messages/search`,
                            body: {
                                text: query,
                                limit: searchLimit,
                            },
                            json: true,
                        };

                        responseData = await this.helpers.httpRequestWithAuthentication.call(
                            this,
                            'zepMemoryApi',
                            options,
                        );
                    }
                }

                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(responseData as IDataObject[]),
                    { itemData: { item: i } },
                );
                returnData.push(...executionData);
            } catch (error: unknown) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error instanceof Error ? error.message : String(error),
                        },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
