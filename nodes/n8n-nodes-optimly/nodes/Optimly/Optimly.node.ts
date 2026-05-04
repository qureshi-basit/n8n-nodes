import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  IHttpRequestOptions,
} from 'n8n-workflow';

export class Optimly implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Optimly',
    name: 'optimly',
    icon: 'file:optimly.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Analytics for AI workflows - track LLM inputs/outputs, errors, token usage, and user frustration',
    defaults: {
      name: 'Optimly',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'optimlyApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials.apiUrl}}',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Track Event',
            value: 'trackEvent',
            description: 'Track an analytics event',
            action: 'Track an analytics event',
          },
          {
            name: 'Track LLM Interaction',
            value: 'trackLlm',
            description: 'Track LLM input/output and token usage',
            action: 'Track LLM input/output and token usage',
          },
          {
            name: 'Track Error',
            value: 'trackError',
            description: 'Track an error or failure',
            action: 'Track an error or failure',
          },
          {
            name: 'Track User Frustration',
            value: 'trackFrustration',
            description: 'Track user frustration indicators',
            action: 'Track user frustration indicators',
          },
          {
            name: 'Get Analytics',
            value: 'getAnalytics',
            description: 'Retrieve analytics data',
            action: 'Retrieve analytics data',
          },
        ],
        default: 'trackEvent',
      },
      // Track Event fields
      {
        displayName: 'Event Name',
        name: 'eventName',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['trackEvent'],
          },
        },
        default: '',
        required: true,
        description: 'Name of the event to track',
      },
      {
        displayName: 'Event Properties',
        name: 'eventProperties',
        type: 'json',
        displayOptions: {
          show: {
            operation: ['trackEvent'],
          },
        },
        default: '{}',
        description: 'Additional properties for the event',
      },
      // Track LLM fields
      {
        displayName: 'Model Name',
        name: 'modelName',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['trackLlm'],
          },
        },
        default: '',
        required: true,
        description: 'Name of the LLM model used',
      },
      {
        displayName: 'Input Text',
        name: 'inputText',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        displayOptions: {
          show: {
            operation: ['trackLlm'],
          },
        },
        default: '',
        required: true,
        description: 'Input text sent to the LLM',
      },
      {
        displayName: 'Output Text',
        name: 'outputText',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        displayOptions: {
          show: {
            operation: ['trackLlm'],
          },
        },
        default: '',
        required: true,
        description: 'Output text received from the LLM',
      },
      {
        displayName: 'Token Usage',
        name: 'tokenUsage',
        type: 'json',
        displayOptions: {
          show: {
            operation: ['trackLlm'],
          },
        },
        default: '{"input_tokens": 0, "output_tokens": 0, "total_tokens": 0}',
        description: 'Token usage statistics',
      },
      {
        displayName: 'Response Time (ms)',
        name: 'responseTime',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['trackLlm'],
          },
        },
        default: 0,
        description: 'Response time in milliseconds',
      },
      // Track Error fields
      {
        displayName: 'Error Type',
        name: 'errorType',
        type: 'options',
        displayOptions: {
          show: {
            operation: ['trackError'],
          },
        },
        options: [
          {
            name: 'API Error',
            value: 'api_error',
          },
          {
            name: 'Validation Error',
            value: 'validation_error',
          },
          {
            name: 'Timeout Error',
            value: 'timeout_error',
          },
          {
            name: 'Rate Limit Error',
            value: 'rate_limit_error',
          },
          {
            name: 'Other',
            value: 'other',
          },
        ],
        default: 'other',
        required: true,
        description: 'Type of error that occurred',
      },
      {
        displayName: 'Error Message',
        name: 'errorMessage',
        type: 'string',
        typeOptions: {
          rows: 3,
        },
        displayOptions: {
          show: {
            operation: ['trackError'],
          },
        },
        default: '',
        required: true,
        description: 'Error message or description',
      },
      {
        displayName: 'Error Context',
        name: 'errorContext',
        type: 'json',
        displayOptions: {
          show: {
            operation: ['trackError'],
          },
        },
        default: '{}',
        description: 'Additional context about the error',
      },
      // Track Frustration fields
      {
        displayName: 'Frustration Indicators',
        name: 'frustrationIndicators',
        type: 'multiOptions',
        displayOptions: {
          show: {
            operation: ['trackFrustration'],
          },
        },
        options: [
          {
            name: 'Multiple Retries',
            value: 'multiple_retries',
          },
          {
            name: 'Long Response Time',
            value: 'long_response_time',
          },
          {
            name: 'Negative Feedback',
            value: 'negative_feedback',
          },
          {
            name: 'Session Abandonment',
            value: 'session_abandonment',
          },
          {
            name: 'Error Frequency',
            value: 'error_frequency',
          },
        ],
        default: [],
        required: true,
        description: 'Select frustration indicators detected',
      },
      {
        displayName: 'Frustration Score',
        name: 'frustrationScore',
        type: 'number',
        typeOptions: {
          minValue: 0,
          maxValue: 10,
        },
        displayOptions: {
          show: {
            operation: ['trackFrustration'],
          },
        },
        default: 5,
        description: 'Frustration score from 0 (none) to 10 (extremely frustrated)',
      },
      {
        displayName: 'Additional Context',
        name: 'additionalContext',
        type: 'json',
        displayOptions: {
          show: {
            operation: ['trackFrustration'],
          },
        },
        default: '{}',
        description: 'Additional context about the frustration',
      },
      // Get Analytics fields
      {
        displayName: 'Time Range',
        name: 'timeRange',
        type: 'options',
        displayOptions: {
          show: {
            operation: ['getAnalytics'],
          },
        },
        options: [
          {
            name: 'Last Hour',
            value: 'last_hour',
          },
          {
            name: 'Last 24 Hours',
            value: 'last_24_hours',
          },
          {
            name: 'Last 7 Days',
            value: 'last_7_days',
          },
          {
            name: 'Last 30 Days',
            value: 'last_30_days',
          },
          {
            name: 'Custom',
            value: 'custom',
          },
        ],
        default: 'last_24_hours',
        description: 'Time range for analytics data',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        displayOptions: {
          show: {
            operation: ['getAnalytics'],
            timeRange: ['custom'],
          },
        },
        default: '',
        description: 'Start date for custom time range',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        displayOptions: {
          show: {
            operation: ['getAnalytics'],
            timeRange: ['custom'],
          },
        },
        default: '',
        description: 'End date for custom time range',
      },
      {
        displayName: 'Metrics',
        name: 'metrics',
        type: 'multiOptions',
        displayOptions: {
          show: {
            operation: ['getAnalytics'],
          },
        },
        options: [
          {
            name: 'Event Count',
            value: 'event_count',
          },
          {
            name: 'LLM Interactions',
            value: 'llm_interactions',
          },
          {
            name: 'Token Usage',
            value: 'token_usage',
          },
          {
            name: 'Error Rate',
            value: 'error_rate',
          },
          {
            name: 'Frustration Score',
            value: 'frustration_score',
          },
          {
            name: 'Response Time',
            value: 'response_time',
          },
        ],
        default: ['event_count'],
        description: 'Metrics to retrieve',
      },
      // Common fields
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        displayOptions: {
          hide: {
            operation: ['getAnalytics'],
          },
        },
        default: '',
        description: 'Optional user identifier',
      },
      {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        displayOptions: {
          hide: {
            operation: ['getAnalytics'],
          },
        },
        default: '',
        description: 'Optional session identifier',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;
      
      let responseData: any = {};

      try {
        if (operation === 'trackEvent') {
          const eventName = this.getNodeParameter('eventName', i) as string;
          const eventProperties = this.getNodeParameter('eventProperties', i) as string;
          const userId = this.getNodeParameter('userId', i) as string;
          const sessionId = this.getNodeParameter('sessionId', i) as string;

          let parsedProperties: IDataObject = {};
          if (eventProperties) {
            try {
              parsedProperties = JSON.parse(eventProperties);
            } catch (error) {
              parsedProperties = {};
            }
          }

          const body: IDataObject = {
            event_name: eventName,
            properties: parsedProperties,
            timestamp: new Date().toISOString(),
          };

          if (userId) body.user_id = userId;
          if (sessionId) body.session_id = sessionId;

          const options: IHttpRequestOptions = {
            method: 'POST',
            url: '/v1/events',
            body,
            json: true,
          };

          responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'optimlyApi', options);

        } else if (operation === 'trackLlm') {
          const modelName = this.getNodeParameter('modelName', i) as string;
          const inputText = this.getNodeParameter('inputText', i) as string;
          const outputText = this.getNodeParameter('outputText', i) as string;
          const tokenUsage = this.getNodeParameter('tokenUsage', i) as string;
          const responseTime = this.getNodeParameter('responseTime', i) as number;
          const userId = this.getNodeParameter('userId', i) as string;
          const sessionId = this.getNodeParameter('sessionId', i) as string;

          let parsedTokenUsage: IDataObject = {};
          if (tokenUsage) {
            try {
              parsedTokenUsage = JSON.parse(tokenUsage);
            } catch (error) {
              parsedTokenUsage = { input_tokens: 0, output_tokens: 0, total_tokens: 0 };
            }
          }

          const body: IDataObject = {
            model_name: modelName,
            input_text: inputText,
            output_text: outputText,
            token_usage: parsedTokenUsage,
            response_time_ms: responseTime,
            timestamp: new Date().toISOString(),
          };

          if (userId) body.user_id = userId;
          if (sessionId) body.session_id = sessionId;

          const options: IHttpRequestOptions = {
            method: 'POST',
            url: '/v1/llm-interactions',
            body,
            json: true,
          };

          responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'optimlyApi', options);

        } else if (operation === 'trackError') {
          const errorType = this.getNodeParameter('errorType', i) as string;
          const errorMessage = this.getNodeParameter('errorMessage', i) as string;
          const errorContext = this.getNodeParameter('errorContext', i) as string;
          const userId = this.getNodeParameter('userId', i) as string;
          const sessionId = this.getNodeParameter('sessionId', i) as string;

          let parsedContext: IDataObject = {};
          if (errorContext) {
            try {
              parsedContext = JSON.parse(errorContext);
            } catch (error) {
              parsedContext = {};
            }
          }

          const body: IDataObject = {
            error_type: errorType,
            error_message: errorMessage,
            context: parsedContext,
            timestamp: new Date().toISOString(),
          };

          if (userId) body.user_id = userId;
          if (sessionId) body.session_id = sessionId;

          const options: IHttpRequestOptions = {
            method: 'POST',
            url: '/v1/errors',
            body,
            json: true,
          };

          responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'optimlyApi', options);

        } else if (operation === 'trackFrustration') {
          const frustrationIndicators = this.getNodeParameter('frustrationIndicators', i) as string[];
          const frustrationScore = this.getNodeParameter('frustrationScore', i) as number;
          const additionalContext = this.getNodeParameter('additionalContext', i) as string;
          const userId = this.getNodeParameter('userId', i) as string;
          const sessionId = this.getNodeParameter('sessionId', i) as string;

          let parsedContext: IDataObject = {};
          if (additionalContext) {
            try {
              parsedContext = JSON.parse(additionalContext);
            } catch (error) {
              parsedContext = {};
            }
          }

          const body: IDataObject = {
            indicators: frustrationIndicators,
            frustration_score: frustrationScore,
            context: parsedContext,
            timestamp: new Date().toISOString(),
          };

          if (userId) body.user_id = userId;
          if (sessionId) body.session_id = sessionId;

          const options: IHttpRequestOptions = {
            method: 'POST',
            url: '/v1/frustration',
            body,
            json: true,
          };

          responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'optimlyApi', options);

        } else if (operation === 'getAnalytics') {
          const timeRange = this.getNodeParameter('timeRange', i) as string;
          const metrics = this.getNodeParameter('metrics', i) as string[];
          const startDate = this.getNodeParameter('startDate', i) as string;
          const endDate = this.getNodeParameter('endDate', i) as string;

          const qs: IDataObject = {
            time_range: timeRange,
            metrics: metrics.join(','),
          };

          if (timeRange === 'custom') {
            if (startDate) qs.start_date = startDate;
            if (endDate) qs.end_date = endDate;
          }

          const options: IHttpRequestOptions = {
            method: 'GET',
            url: '/v1/analytics',
            qs,
            json: true,
          };

          responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'optimlyApi', options);
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );

        returnData.push(...executionData);

      } catch (error: unknown) {
        if (this.continueOnFail()) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          returnData.push({
            json: { error: errorMessage },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
