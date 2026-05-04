import {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class Razorpay implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Razorpay',
		name: 'razorpay',
		icon: 'file:razorpay.svg',
		group: ['finance'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Native Razorpay payment integration for generating payment links and verifying completion',
		defaults: {
			name: 'Razorpay',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'razorpayApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.razorpay.com/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Payment Link',
						value: 'paymentLink',
					},
					{
						name: 'Payment',
						value: 'payment',
					},
					{
						name: 'Order',
						value: 'order',
					},
				],
				default: 'paymentLink',
			},

			// Payment Link Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['paymentLink'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a payment link',
						action: 'Create a payment link',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a payment link by ID',
						action: 'Get a payment link',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all payment links',
						action: 'Get all payment links',
					},
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel a payment link',
						action: 'Cancel a payment link',
					},
				],
				default: 'create',
			},

			// Payment Operations  
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['payment'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a payment by ID',
						action: 'Get a payment',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all payments',
						action: 'Get all payments',
					},
					{
						name: 'Capture',
						value: 'capture',
						description: 'Capture a payment',
						action: 'Capture a payment',
					},
				],
				default: 'get',
			},

			// Order Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create an order',
						action: 'Create an order',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an order by ID',
						action: 'Get an order',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all orders',
						action: 'Get all orders',
					},
				],
				default: 'create',
			},

			// Payment Link Create Fields
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentLink'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'Amount in the smallest currency unit (e.g., paise for INR)',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentLink'],
						operation: ['create'],
					},
				},
				default: 'INR',
				description: 'Currency code',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['paymentLink'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Payment description',
			},
			{
				displayName: 'Customer Name',
				name: 'customerName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['paymentLink'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Customer name',
			},
			{
				displayName: 'Customer Email',
				name: 'customerEmail',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['paymentLink'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Customer email',
			},
			{
				displayName: 'Customer Contact',
				name: 'customerContact',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['paymentLink'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Customer contact number',
			},

			// Order Create Fields
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				default: 0,
				description: 'Amount in the smallest currency unit (e.g., paise for INR)',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				default: 'INR',
				description: 'Currency code',
			},
			{
				displayName: 'Receipt',
				name: 'receipt',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Your receipt ID for reference',
			},

			// ID Fields for Get operations
			{
				displayName: 'Payment Link ID',
				name: 'paymentLinkId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['paymentLink'],
						operation: ['get', 'cancel'],
					},
				},
				default: '',
				description: 'ID of the payment link',
			},
			{
				displayName: 'Payment ID',
				name: 'paymentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['get', 'capture'],
					},
				},
				default: '',
				description: 'ID of the payment',
			},
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['order'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'ID of the order',
			},

			// Capture Amount
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['capture'],
					},
				},
				default: 0,
				description: 'Amount to capture in the smallest currency unit',
			},

			// Pagination for Get All operations
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['paymentLink', 'payment', 'order'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['paymentLink', 'payment', 'order'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData: any = {};
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'paymentLink') {
					if (operation === 'create') {
						const amount = this.getNodeParameter('amount', i) as number;
						const currency = this.getNodeParameter('currency', i) as string;
						const description = this.getNodeParameter('description', i) as string;
						const customerName = this.getNodeParameter('customerName', i) as string;
						const customerEmail = this.getNodeParameter('customerEmail', i) as string;
						const customerContact = this.getNodeParameter('customerContact', i) as string;

						const body: IDataObject = {
							amount,
							currency,
						};

						if (description) body.description = description;

						if (customerName || customerEmail || customerContact) {
							body.customer = {};
							if (customerName) (body.customer as IDataObject).name = customerName;
							if (customerEmail) (body.customer as IDataObject).email = customerEmail;
							if (customerContact) (body.customer as IDataObject).contact = customerContact;
						}

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/payment_links',
							body,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);

					} else if (operation === 'get') {
						const paymentLinkId = this.getNodeParameter('paymentLinkId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/payment_links/${paymentLinkId}`,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.count = limit;
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: '/payment_links',
							qs,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);
						responseData = responseData.items || [];

					} else if (operation === 'cancel') {
						const paymentLinkId = this.getNodeParameter('paymentLinkId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'PATCH',
							url: `/payment_links/${paymentLinkId}/cancel`,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);
					}

				} else if (resource === 'payment') {
					if (operation === 'get') {
						const paymentId = this.getNodeParameter('paymentId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/payments/${paymentId}`,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.count = limit;
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: '/payments',
							qs,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);
						responseData = responseData.items || [];

					} else if (operation === 'capture') {
						const paymentId = this.getNodeParameter('paymentId', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;

						const body: IDataObject = {
							amount,
						};

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `/payments/${paymentId}/capture`,
							body,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);
					}

				} else if (resource === 'order') {
					if (operation === 'create') {
						const amount = this.getNodeParameter('amount', i) as number;
						const currency = this.getNodeParameter('currency', i) as string;
						const receipt = this.getNodeParameter('receipt', i) as string;

						const body: IDataObject = {
							amount,
							currency,
						};

						if (receipt) body.receipt = receipt;

						const options: IHttpRequestOptions = {
							method: 'POST',
							url: '/orders',
							body,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);

					} else if (operation === 'get') {
						const orderId = this.getNodeParameter('orderId', i) as string;

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `/orders/${orderId}`,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const qs: IDataObject = {};
						if (!returnAll) {
							qs.count = limit;
						}

						const options: IHttpRequestOptions = {
							method: 'GET',
							url: '/orders',
							qs,
							json: true,
						};

						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'razorpayApi', options);
						responseData = responseData.items || [];
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push(...this.helpers.returnJsonArray(responseData));
				} else {
					returnData.push({json: responseData});
				}

			} catch (error: unknown) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error)
						}
					});
					continue;
				}
				throw error;
			}
		}

		return this.helpers.constructExecutionMetaData(returnData, {itemData: {item: 0}});
	}
}
