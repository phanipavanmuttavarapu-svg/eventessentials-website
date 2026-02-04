'use server'
import { SearchServiceClient } from '@google-cloud/discoveryengine';

/**
 * Unified Server Action for Decor and Event Shopping.
 * Handles both Image search (Decor) and Web search (Shopping).
 */
export async function unifiedSearchAction(query: string, dataStoreId: string, isImageSearch: boolean = false) {
  // 1. Initialize credentials from your Vercel Environment Variable
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_KEY || '{}');

  const client = new SearchServiceClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    projectId: 'eventessentials-485915', // Your verified Project ID
  });

  // 2. Define the path to your specific data store engine
  const servingConfig = client.projectLocationCollectionDataStoreServingConfigPath(
    'eventessentials-485915',
    'global',
    'default_collection',
    dataStoreId,
    'default_search'
  );

  // 3. Execute the search
  // Added 'await' and cast 'search_type' to 'any' to fix the IValue error
  const [response] = (await client.search({
    servingConfig,
    query: query,
    pageSize: 8,
    params: {
      search_type: (isImageSearch ? 1 : 0) as any
    }
  })) as any;

  // 4. Format results to match your existing frontend requirements
  return response?.results?.map((res: any) => ({
    title: res.document?.derivedStructData?.fields?.title?.stringValue || "Untitled",
    link: res.document?.derivedStructData?.fields?.link?.stringValue || "#",
    snippet: res.document?.derivedStructData?.fields?.snippet?.stringValue || ""
  })) || [];
}