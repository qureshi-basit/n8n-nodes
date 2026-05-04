import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestOptions,
    IDataObject,
} from 'n8n-workflow';

export class NanoBanana implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Nano Banana',
        name: 'nanoBanana',
        icon: 'file:nanoBanana.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{"$parameter[\"resource\"]"}}: {{"$parameter[\"operation\"]"}}',
        description: 'AI image/video generation service for creating ad creatives and product visuals',
        defaults: { name: 'Nano Banana' },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [{ name: 'nanoBananaApi', required: true }],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Image',
                        value: 'image',
                    },
                    {
                        name: 'Video',
                        value: 'video',
                    },
                    {
                        name: 'Project',
                        value: 'project',
                    },
                ],
                default: 'image',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['image'],
                    },
                },
                options: [
                    {
                        name: 'Generate',
                        value: 'generate',
                        description: 'Generate AI image from text prompt',
                        action: 'Generate an image',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get image details',
                        action: 'Get an image',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'List generated images',
                        action: 'List images',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete an image',
                        action: 'Delete an image',
                    },
                ],
                default: 'generate',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['video'],
                    },
                },
                options: [
                    {
                        name: 'Generate',
                        value: 'generate',
                        description: 'Generate AI video from text prompt',
                        action: 'Generate a video',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get video details',
                        action: 'Get a video',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'List generated videos',
                        action: 'List videos',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete a video',
                        action: 'Delete a video',
                    },
                ],
                default: 'generate',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['project'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a new project',
                        action: 'Create a project',
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get project details',
                        action: 'Get a project',
                    },
                    {
                        name: 'List',
                        value: 'list',
                        description: 'List projects',
                        action: 'List projects',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update a project',
                        action: 'Update a project',
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        description: 'Delete a project',
                        action: 'Delete a project',
                    },
                ],
                default: 'create',
            },
            // Image Generate Fields
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                displayOptions: {
                    show: {
                        resource: ['image'],
                        operation: ['generate'],
                    },
                },
                default: '',
                required: true,
                description: 'Text description of the image to generate',
                placeholder: 'A photorealistic product shot of a smartphone on a white background',
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['image'],
                        operation: ['generate'],
                    },
                },
                options: [
                    {
                        name: 'Gemini 2.5 Flash Image',
                        value: 'gemini-2.5-flash-image',
                    },
                    {
                        name: 'DALL-E 3',
                        value: 'dall-e-3',
                    },
                    {
                        name: 'Midjourney v6',
                        value: 'midjourney-v6',
                    },
                    {
                        name: 'Stable Diffusion XL',
                        value: 'stable-diffusion-xl',
                    },
                ],
                default: 'gemini-2.5-flash-image',
                description: 'AI model to use for image generation',
            },
            {
                displayName: 'Style',
                name: 'style',
                type: 'options',
                displayOptions: {
                    show: {
                        resource: ['image'],
                        operation: ['generate'],
                    },
                },
                options: [
                    {
                        name: 'Photorealistic',
                        value: 'photorealistic',
                    },
                    {
                        name: 'Illustration',
                        value: 'illustration',
                    },
                    {
                        name: 'Digital Art',
                        value: 'digital-art',
                    },
                    {
                        name: 'Product Shot',
                        value: 'product-shot',
                    },
                    {
                        name: 'Advertisement',
                        value: 'advertisement',
                    },
                ],
                default: 'photorealistic',
                description: 'Visual style for the generated image',
            },
            {
                displayName: 'Width',
                name: 'width',
                type: 'number',
                displayOptions: {
                    show: {
                        resource: ['image'],
                        operation: ['generate'],
                    },
                },
                default: 1024,
                description: 'Image width in pixels',
            },
            {
                displayName: 'Height',
                name: 'height',
                type: 'number',
                displayOptions: {
                    show: {
                        resource: ['image'],
                        operation: ['generate'],
                    },
                },
                default: 1024,
                description: 'Image height in pixels',
            },
            // Video Generate Fields
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                displayOptions: {
                    show: {
                        resource: ['video'],
                        operation: ['generate'],
                    },
                },
                default: '',
                required: true,
                description: 'Text description of the video to generate',
                placeholder: 'A product demo video showing a smartphone rotating 360 degrees',
            },
            {
                displayName: 'Duration',
                name: 'duration',
                type: 'number',
                displayOptions: {
                    show: {
                        resource: ['video'],
                        operation: ['generate'],
                    },
                },
                default: 5,
                description: 'Video duration in seconds',
            },
            // ID Fields for Get/Delete operations
            {
                displayName: 'Image ID',
                name: 'imageId',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['image'],
                        operation: ['get', 'delete'],
                    },
                },
                default: '',
                required: true,
                description: 'ID of the image',
            },
            {
                displayName: 'Video ID',
                name: 'videoId',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['video'],
                        operation: ['get', 'delete'],
                    },
                },
                default: '',
                required: true,
                description: 'ID of the video',
            },
            {
                displayName: 'Project ID',
                name: 'projectId',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['project'],
                        operation: ['get', 'update', 'delete'],
                    },
                },
                default: '',
                required: true,
                description: 'ID of the project',
            },
            // Project Fields
            {
                displayName: 'Project Name',
                name: 'projectName',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['project'],
                        operation: ['create', 'update'],
                    },
                },
                default: '',
                required: true,
                description: 'Name of the project',
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 2,
                },
                displayOptions: {
                    show: {
                        resource: ['project'],
                        operation: ['create', 'update'],
                    },
                },
                default: '',
                description: 'Project description',
            },
            // List Parameters
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                default: 50,
                description: 'Maximum number of items to return',
            },
            {
                displayName: 'Offset',
                name: 'offset',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['list'],
                    },
                },
                default: 0,
                description: 'Number of items to skip',
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
                let responseData: any = {};

                const options: IHttpRequestOptions = {
                    method: 'GET',
                    url: '',
                    json: true,
                };

                if (resource === 'image') {
                    if (operation === 'generate') {
                        const prompt = this.getNodeParameter('prompt', i) as string;
                        const model = this.getNodeParameter('model', i) as string;
                        const style = this.getNodeParameter('style', i) as string;
                        const width = this.getNodeParameter('width', i) as number;
                        const height = this.getNodeParameter('height', i) as number;

                        options.method = 'POST';
                        options.url = 'https://api.nanobanana.com/v1/images/generate';
                        options.body = {
                            prompt,
                            model,
                            style,
                            width,
                            height,
                        };
                    } else if (operation === 'get') {
                        const imageId = this.getNodeParameter('imageId', i) as string;
                        options.method = 'GET';
                        options.url = `https://api.nanobanana.com/v1/images/${imageId}`;
                    } else if (operation === 'list') {
                        const limit = this.getNodeParameter('limit', i) as number;
                        const offset = this.getNodeParameter('offset', i) as number;
                        options.method = 'GET';
                        options.url = 'https://api.nanobanana.com/v1/images';
                        options.qs = { limit, offset };
                    } else if (operation === 'delete') {
                        const imageId = this.getNodeParameter('imageId', i) as string;
                        options.method = 'DELETE';
                        options.url = `https://api.nanobanana.com/v1/images/${imageId}`;
                    }
                } else if (resource === 'video') {
                    if (operation === 'generate') {
                        const prompt = this.getNodeParameter('prompt', i) as string;
                        const duration = this.getNodeParameter('duration', i) as number;

                        options.method = 'POST';
                        options.url = 'https://api.nanobanana.com/v1/videos/generate';
                        options.body = {
                            prompt,
                            duration,
                        };
                    } else if (operation === 'get') {
                        const videoId = this.getNodeParameter('videoId', i) as string;
                        options.method = 'GET';
                        options.url = `https://api.nanobanana.com/v1/videos/${videoId}`;
                    } else if (operation === 'list') {
                        const limit = this.getNodeParameter('limit', i) as number;
                        const offset = this.getNodeParameter('offset', i) as number;
                        options.method = 'GET';
                        options.url = 'https://api.nanobanana.com/v1/videos';
                        options.qs = { limit, offset };
                    } else if (operation === 'delete') {
                        const videoId = this.getNodeParameter('videoId', i) as string;
                        options.method = 'DELETE';
                        options.url = `https://api.nanobanana.com/v1/videos/${videoId}`;
                    }
                } else if (resource === 'project') {
                    if (operation === 'create') {
                        const projectName = this.getNodeParameter('projectName', i) as string;
                        const description = this.getNodeParameter('description', i) as string;

                        options.method = 'POST';
                        options.url = 'https://api.nanobanana.com/v1/projects';
                        options.body = {
                            name: projectName,
                            description,
                        };
                    } else if (operation === 'get') {
                        const projectId = this.getNodeParameter('projectId', i) as string;
                        options.method = 'GET';
                        options.url = `https://api.nanobanana.com/v1/projects/${projectId}`;
                    } else if (operation === 'list') {
                        const limit = this.getNodeParameter('limit', i) as number;
                        const offset = this.getNodeParameter('offset', i) as number;
                        options.method = 'GET';
                        options.url = 'https://api.nanobanana.com/v1/projects';
                        options.qs = { limit, offset };
                    } else if (operation === 'update') {
                        const projectId = this.getNodeParameter('projectId', i) as string;
                        const projectName = this.getNodeParameter('projectName', i) as string;
                        const description = this.getNodeParameter('description', i) as string;

                        options.method = 'PUT';
                        options.url = `https://api.nanobanana.com/v1/projects/${projectId}`;
                        options.body = {
                            name: projectName,
                            description,
                        };
                    } else if (operation === 'delete') {
                        const projectId = this.getNodeParameter('projectId', i) as string;
                        options.method = 'DELETE';
                        options.url = `https://api.nanobanana.com/v1/projects/${projectId}`;
                    }
                }

                responseData = await this.helpers.httpRequestWithAuthentication.call(
                    this,
                    'nanoBananaApi',
                    options,
                );

                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(responseData as IDataObject[]),
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
