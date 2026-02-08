'use server'
import { SearchServiceClient } from '@google-cloud/discoveryengine';

export async function unifiedSearchAction(query: string, dataStoreId: string, isImageSearch: boolean = false) {
  try {
    const base64Key = process.env.GOOGLE_SERVICE_KEY_BASE64;
    if (!base64Key) {
      console.warn("Missing GOOGLE_SERVICE_KEY_BASE64 - returning empty results. Set up your Google Cloud credentials in .env.local");
      return [];
    }

    // Decode the Base64 back to a JSON string, then parse it
    const jsonString = Buffer.from(base64Key, 'base64').toString('utf-8');
    const credentials = JSON.parse(jsonString);

    const client = new SearchServiceClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id,
    });

    const servingConfig = client.projectLocationCollectionDataStoreServingConfigPath(
      credentials.project_id,
      'global',
      'default_collection',
      dataStoreId,
      'default_search'
    );

    // Casting 'search_type' to 'any' fixes the TypeScript errors
    const [response] = (await client.search({
      servingConfig,
      query: query,
      pageSize: 8,
      params: { 
        search_type: (isImageSearch ? 1 : 0) as any 
      }
    })) as any;

    return response?.results?.map((res: any) => ({
      title: res.document?.derivedStructData?.title || "Untitled",
      link: res.document?.derivedStructData?.link || "#",
      image: res.document?.derivedStructData?.pagemap?.cse_image?.[0]?.src || null,
      snippet: res.document?.derivedStructData?.snippet || ""
    })) || [];

  } catch (error: any) {
    // This will appear in your Vercel logs or terminal
    console.error("Vercel Server Action Error:", error.message);
    throw new Error(`Search failed: ${error.message}`);
  }
}