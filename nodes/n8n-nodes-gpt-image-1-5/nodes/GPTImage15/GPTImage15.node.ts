import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestOptions,
    IDataObject,
} from 'n8n-workflow';

export class GPTImage15 implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'GPT Image 1.5',
        name: 'gPTImage15',
        icon: 'file:gPTImage15.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{"$parameter[\"operation\"]"}}',
        description: 'Generate images using GPT Image 1.5 AI model',
        defaults: { name: 'GPT Image 1.5' },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [{ name: 'gPTImage15Api', required: true }],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Generate Image',
                        value: 'generateImage',
                        description: 'Generate an image from a text prompt',
                        action: 'Generate an image from text prompt',
                    },
                    {
                        name: 'Generate Variations',
                        value: 'generateVariations',
                        description: 'Generate variations of an existing image',
                        action: 'Generate variations of an image',
                    },
                    {
                        name: 'Edit Image',
                        value: 'editImage',
                        description: 'Edit an image with a text prompt and mask',
                        action: 'Edit an image with prompt and mask',
                    },
                    {
                        name: 'Get Generation Status',
                        value: 'getStatus',
                        description: 'Get the status of an image generation task',
                        action: 'Get generation status',
                    },
                ],
                default: 'generateImage',
            },
            // Generate Image fields
            {
                displayName: 'Prompt',
                name: 'prompt',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['generateImage', 'editImage'],
                    },
                },
                default: '',
                description: 'Text description of the image you want to generate',
                placeholder: 'A beautiful sunset over mountains',
            },
            {
                displayName: 'Size',
                name: 'size',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['generateImage', 'generateVariations'],
                    },
                },
                options: [
                    {
                        name: '256x256',
                        value: '256x256',
                    },
                    {
                        name: '512x512',
                        value: '512x512',
                    },
                    {
                        name: '1024x1024',
                        value: '1024x1024',
                    },
                    {
                        name: '1792x1024',
                        value: '1792x1024',
                    },
                    {
                        name: '1024x1792',
                        value: '1024x1792',
                    },
                ],
                default: '1024x1024',
                description: 'The size of the generated image',
            },
            {
                displayName: 'Quality',
                name: 'quality',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['generateImage'],
                    },
                },
                options: [
                    {
                        name: 'Standard',
                        value: 'standard',
                    },
                    {
                        name: 'HD',
                        value: 'hd',
                    },
                ],
                default: 'standard',
                description: 'The quality of the image that will be generated',
            },
            {
                displayName: 'Style',
                name: 'style',
                type: 'options',
                displayOptions: {
                    show: {
                        operation: ['generateImage'],
                    },
                },
                options: [
                    {
                        name: 'Vivid',
                        value: 'vivid',
                    },
                    {
                        name: 'Natural',
                        value: 'natural',
                    },
                ],
                default: 'vivid',
                description: 'The style of the generated image',
            },
            {
                displayName: 'Number of Images',
                name: 'numberOfImages',
                type: 'number',
                displayOptions: {
                    show: {
                        operation: ['generateImage', 'generateVariations'],
                    },
                },
                typeOptions: {
                    minValue: 1,
                    maxValue: 10,
                },
                default: 1,
                description: 'The number of images to generate',
            },
            // Generate Variations fields
            {
                displayName: 'Image URL',
                name: 'imageUrl',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['generateVariations'],
                    },
                },
                default: '',
                description: 'URL of the image to create variations from',
            },
            // Edit Image fields
            {
                displayName: 'Original Image URL',
                name: 'originalImageUrl',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['editImage'],
                    },
                },
                default: '',
                description: 'URL of the original image to edit',
            },
            {
                displayName: 'Mask URL',
                name: 'maskUrl',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['editImage'],
                    },
                },
                default: '',
                description: 'URL of the mask image (optional)',
            },
            // Get Status fields
            {
                displayName: 'Task ID',
                name: 'taskId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['getStatus'],
                    },
                },
                default: '',
                description: 'ID of the generation task to check',
            },
            // Additional options
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        operation: ['generateImage', 'generateVariations', 'editImage'],
                    },
                },
                options: [
                    {
                        displayName: 'Negative Prompt',
                        name: 'negativePrompt',
                        type: 'string',
                        default: '',
                        description: 'What you do NOT want in the image',
                    },
                    {
                        displayName: 'Seed',
                        name: 'seed',
                        type: 'number',
                        default: -1,
                        description: 'Random seed for reproducible results (-1 for random)',
                    },
                    {
                        displayName: 'Steps',
                        name: 'steps',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                            maxValue: 100,
                        },
                        default: 20,
                        description: 'Number of inference steps',
                    },
                    {
                        displayName: 'Guidance Scale',
                        name: 'guidanceScale',
                        type: 'number',
                        typeOptions: {
                            minValue: 1,
                            maxValue: 20,
                        },
                        default: 7.5,
                        description: 'How closely to follow the prompt',
                    },
                    {
                        displayName: 'Response Format',
                        name: 'responseFormat',
                        type: 'options',
                        options: [
                            {
                                name: 'URL',
                                value: 'url',
                            },
                            {
                                name: 'Base64 JSON',
                                value: 'b64_json',
                            },
                        ],
                        default: 'url',
                        description: 'Format of the returned image',
                    },
                ],
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i) as string;
                let responseData: any;

                if (operation === 'generateImage') {
                    const prompt = this.getNodeParameter('prompt', i) as string;
                    const size = this.getNodeParameter('size', i) as string;
                    const quality = this.getNodeParameter('quality', i) as string;
                    const style = this.getNodeParameter('style', i) as string;
                    const numberOfImages = this.getNodeParameter('numberOfImages', i) as number;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                    const body: IDataObject = {
                        prompt,
                        model: 'gpt-image-1.5',
                        n: numberOfImages,
                        size,
                        quality,
                        style,
                        response_format: additionalFields.responseFormat || 'url',
                    };

                    if (additionalFields.negativePrompt) {
                        body.negative_prompt = additionalFields.negativePrompt;
                    }
                    if (additionalFields.seed && additionalFields.seed !== -1) {
                        body.seed = additionalFields.seed;
                    }
                    if (additionalFields.steps) {
                        body.steps = additionalFields.steps;
                    }
                    if (additionalFields.guidanceScale) {
                        body.guidance_scale = additionalFields.guidanceScale;
                    }

                    const options: IHttpRequestOptions = {
                        method: 'POST',
                        url: 'https://api.gptimage15.com/v1/images/generations',
                        body,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'gPTImage15Api',
                        options,
                    );

                } else if (operation === 'generateVariations') {
                    const imageUrl = this.getNodeParameter('imageUrl', i) as string;
                    const size = this.getNodeParameter('size', i) as string;
                    const numberOfImages = this.getNodeParameter('numberOfImages', i) as number;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                    const body: IDataObject = {
                        image: imageUrl,
                        n: numberOfImages,
                        size,
                        response_format: additionalFields.responseFormat || 'url',
                    };

                    if (additionalFields.seed && additionalFields.seed !== -1) {
                        body.seed = additionalFields.seed;
                    }
                    if (additionalFields.steps) {
                        body.steps = additionalFields.steps;
                    }

                    const options: IHttpRequestOptions = {
                        method: 'POST',
                        url: 'https://api.gptimage15.com/v1/images/variations',
                        body,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'gPTImage15Api',
                        options,
                    );

                } else if (operation === 'editImage') {
                    const prompt = this.getNodeParameter('prompt', i) as string;
                    const originalImageUrl = this.getNodeParameter('originalImageUrl', i) as string;
                    const maskUrl = this.getNodeParameter('maskUrl', i) as string;
                    const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                    const body: IDataObject = {
                        image: originalImageUrl,
                        prompt,
                        n: 1,
                        size: '1024x1024',
                        response_format: additionalFields.responseFormat || 'url',
                    };

                    if (maskUrl) {
                        body.mask = maskUrl;
                    }
                    if (additionalFields.seed && additionalFields.seed !== -1) {
                        body.seed = additionalFields.seed;
                    }
                    if (additionalFields.steps) {
                        body.steps = additionalFields.steps;
                    }
                    if (additionalFields.guidanceScale) {
                        body.guidance_scale = additionalFields.guidanceScale;
                    }

                    const options: IHttpRequestOptions = {
                        method: 'POST',
                        url: 'https://api.gptimage15.com/v1/images/edits',
                        body,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'gPTImage15Api',
                        options,
                    );

                } else if (operation === 'getStatus') {
                    const taskId = this.getNodeParameter('taskId', i) as string;

                    const options: IHttpRequestOptions = {
                        method: 'GET',
                        url: `https://api.gptimage15.com/v1/tasks/${taskId}`,
                        json: true,
                    };

                    responseData = await this.helpers.httpRequestWithAuthentication.call(
                        this,
                        'gPTImage15Api',
                        options,
                    );
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
