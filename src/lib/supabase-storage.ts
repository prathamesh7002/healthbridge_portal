import { supabase } from './supabaseClient';

// Upload file to Supabase Storage (Native API)
export async function uploadFileToSupabaseStorage(
    file: File,
    bucketName: string = 'health-reports',
    folder: string = 'reports'
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Validate inputs
        if (!file) {
            throw new Error('No file provided');
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${folder}/${timestamp}-${sanitizedFileName}`;

        // Attempt to upload
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        // Check for upload errors
        if (error) {
            console.error('Upload Error:', error);
            
            // Check if bucket doesn't exist
            if (error.message.includes('bucket does not exist') || error.message.includes('Bucket not found')) {
                // List available buckets to help diagnose
                const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
                
                if (bucketError) {
                    console.error('Error listing buckets:', bucketError);
                    throw new Error(`Bucket '${bucketName}' does not exist and couldn't list available buckets.`);
                } else {
                    console.log('Available buckets:', buckets?.map(b => b.name));
                    const availableBucketNames = buckets?.map(b => b.name).join(', ') || 'none';
                    throw new Error(`Bucket '${bucketName}' does not exist. Available buckets: ${availableBucketNames}`);
                }
            }
            
            throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        return {
            success: true,
            url: publicUrlData.publicUrl,
        };

    } catch (error) {
        console.error('Supabase Storage Upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to upload file',
        };
    }
}

// Get list of available buckets for debugging
export async function listAvailableBuckets(): Promise<string[]> {
    try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
            console.error('Error listing buckets:', error);
            return [];
        }
        return data?.map(bucket => bucket.name) || [];
    } catch (error) {
        console.error('Error listing buckets:', error);
        return [];
    }
}
