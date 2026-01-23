/**
 * API Client for executing requests from Postman collections
 */

import { ParsedEndpoint, ParsedCollection, replaceVariables } from './postmanParser';

export interface APIRequestOptions {
  endpoint: ParsedEndpoint;
  variables?: Record<string, string>;
  additionalHeaders?: Record<string, string>;
  additionalParams?: Record<string, string>;
}

export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode?: number;
  headers?: Record<string, string>;
}

/**
 * Execute API request from parsed endpoint
 */
export async function executeAPIRequest(
  options: APIRequestOptions
): Promise<APIResponse> {
  const { endpoint, variables = {}, additionalHeaders = {}, additionalParams = {} } = options;

  try {
    // Build URL with variables replaced
    let url = replaceVariables(endpoint.url, variables);

    // Add query parameters
    // Include variables that aren't already in endpoint.queryParams
    const allParams = { ...endpoint.queryParams, ...variables, ...additionalParams };
    const queryString = Object.keys(allParams)
      .filter(key => allParams[key] !== undefined && allParams[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(replaceVariables(String(allParams[key]), variables))}`)
      .join('&');

    if (queryString) {
      url = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`;
    }

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...endpoint.headers,
      ...additionalHeaders,
    };

    // Replace variables in headers
    Object.keys(headers).forEach(key => {
      headers[key] = replaceVariables(headers[key], variables);
    });

    // Add authentication
    if (endpoint.auth) {
      if (endpoint.auth.type === 'apikey') {
        const keyName = endpoint.auth.credentials.key || 'access_key';
        const keyValue = replaceVariables(endpoint.auth.credentials.value || '', variables);
        
        // Check if API key should be in header or query
        const inHeader = endpoint.auth.credentials.in === 'header';
        
        if (inHeader) {
          headers[keyName] = keyValue;
        } else {
          // Already added in query params
        }
      } else if (endpoint.auth.type === 'bearer') {
        const token = replaceVariables(endpoint.auth.credentials.token || '', variables);
        headers['Authorization'] = `Bearer ${token}`;
      } else if (endpoint.auth.type === 'basic') {
        const username = replaceVariables(endpoint.auth.credentials.username || '', variables);
        const password = replaceVariables(endpoint.auth.credentials.password || '', variables);
        const encoded = btoa(`${username}:${password}`);
        headers['Authorization'] = `Basic ${encoded}`;
      }
    }

    // Make request
    const response = await fetch(url, {
      method: endpoint.method,
      headers,
    });

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
        headers: responseHeaders,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data,
      statusCode: response.status,
      headers: responseHeaders,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Execute multiple API requests in sequence
 */
export async function executeMultipleRequests(
  endpoints: ParsedEndpoint[],
  variables: Record<string, string> = {}
): Promise<APIResponse[]> {
  const results: APIResponse[] = [];

  for (const endpoint of endpoints) {
    const result = await executeAPIRequest({ endpoint, variables });
    results.push(result);
  }

  return results;
}

/**
 * Convert API response to tabular format
 */
export function convertToTabular(response: APIResponse): any[] {
  if (!response.success || !response.data) {
    return [];
  }

  const data = response.data;

  // Handle different response structures
  if (Array.isArray(data)) {
    return data;
  }

  // Check for common pagination patterns
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }

  if (data.results && Array.isArray(data.results)) {
    return data.results;
  }

  if (data.items && Array.isArray(data.items)) {
    return data.items;
  }

  // If it's a single object, wrap it in an array
  if (typeof data === 'object') {
    return [data];
  }

  return [];
}

