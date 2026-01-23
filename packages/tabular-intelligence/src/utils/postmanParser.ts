/**
 * Postman Collection Parser
 * Parses Postman Collection v2.1 format and extracts API endpoints
 */

export interface PostmanVariable {
  key: string;
  value: string;
  type?: string;
}

export interface PostmanAuth {
  type: string;
  apikey?: Array<{ key: string; value: string; type: string }>;
  bearer?: Array<{ key: string; value: string; type: string }>;
  basic?: Array<{ key: string; value: string; type: string }>;
}

export interface PostmanHeader {
  key: string;
  value: string;
  type?: string;
}

export interface PostmanQueryParam {
  key: string;
  value: string;
  description?: string;
}

export interface PostmanRequest {
  method: string;
  header?: PostmanHeader[];
  url: {
    raw: string;
    protocol?: string;
    host?: string[];
    path?: string[];
    query?: PostmanQueryParam[];
  };
  auth?: PostmanAuth;
  description?: string;
}

export interface PostmanItem {
  name: string;
  request: PostmanRequest;
  response?: any[];
  item?: PostmanItem[]; // For folders
}

export interface PostmanCollection {
  info: {
    name: string;
    description?: string;
    schema: string;
  };
  item: PostmanItem[];
  auth?: PostmanAuth;
  variable?: PostmanVariable[];
}

export interface ParsedEndpoint {
  name: string;
  method: string;
  url: string;
  description?: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  auth?: {
    type: string;
    credentials: Record<string, string>;
  };
}

export interface ParsedCollection {
  name: string;
  description?: string;
  endpoints: ParsedEndpoint[];
  variables: Record<string, string>;
  auth?: {
    type: string;
    credentials: Record<string, string>;
  };
}

/**
 * Parse Postman Collection JSON
 */
export function parsePostmanCollection(collection: PostmanCollection): ParsedCollection {
  const variables: Record<string, string> = {};
  
  // Parse collection-level variables
  if (collection.variable) {
    collection.variable.forEach(v => {
      variables[v.key] = v.value;
    });
  }

  // Parse collection-level auth
  const collectionAuth = collection.auth ? parseAuth(collection.auth) : undefined;

  // Parse all endpoints (flatten nested items)
  const endpoints: ParsedEndpoint[] = [];
  
  function parseItems(items: PostmanItem[], parentPath: string = '') {
    items.forEach(item => {
      if (item.item) {
        // It's a folder, recurse
        parseItems(item.item, parentPath ? `${parentPath}/${item.name}` : item.name);
      } else if (item.request) {
        // It's an endpoint
        endpoints.push(parseEndpoint(item, collectionAuth));
      }
    });
  }

  parseItems(collection.item);

  return {
    name: collection.info.name,
    description: collection.info.description,
    endpoints,
    variables,
    auth: collectionAuth,
  };
}

/**
 * Parse individual endpoint
 */
function parseEndpoint(item: PostmanItem, collectionAuth?: any): ParsedEndpoint {
  const request = item.request;
  
  // Parse headers
  const headers: Record<string, string> = {};
  if (request.header) {
    request.header.forEach(h => {
      headers[h.key] = h.value;
    });
  }

  // Parse query parameters
  const queryParams: Record<string, string> = {};
  if (request.url.query) {
    request.url.query.forEach(q => {
      queryParams[q.key] = q.value;
    });
  }

  // Parse auth (request-level overrides collection-level)
  const auth = request.auth ? parseAuth(request.auth) : collectionAuth;

  return {
    name: item.name,
    method: request.method,
    url: request.url.raw,
    description: request.description,
    headers,
    queryParams,
    auth,
  };
}

/**
 * Parse authentication
 */
function parseAuth(auth: PostmanAuth): { type: string; credentials: Record<string, string> } {
  const credentials: Record<string, string> = {};

  if (auth.apikey) {
    auth.apikey.forEach(item => {
      credentials[item.key] = item.value;
    });
  } else if (auth.bearer) {
    auth.bearer.forEach(item => {
      credentials[item.key] = item.value;
    });
  } else if (auth.basic) {
    auth.basic.forEach(item => {
      credentials[item.key] = item.value;
    });
  }

  return {
    type: auth.type,
    credentials,
  };
}

/**
 * Replace variables in URL and parameters
 */
export function replaceVariables(
  text: string,
  variables: Record<string, string>
): string {
  let result = text;
  
  // Replace {{variable}} syntax
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key]);
  });

  return result;
}

