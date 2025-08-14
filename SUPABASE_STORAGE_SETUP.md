# Supabase Storage Setup for Medical Documents

## Prerequisites
1. You need a Supabase project with storage enabled
2. Your project reference: `pjrrooswyrzecglsngyn`
3. Storage URL: `https://pjrrooswyrzecglsngyn.storage.supabase.co/storage/v1/s3`

## Setup Steps

### 1. Create Storage Bucket
1. Go to your Supabase dashboard
2. Navigate to Storage section
3. Create a new bucket with the name: `health-reports`
4. Set the bucket to be **public** if you want files to be accessible via public URLs
5. Alternatively, keep it private and use signed URLs for secure access

### 1.1. Get S3 Access Keys
1. In your Supabase dashboard, go to Settings > Storage
2. Scroll down to find "S3 access keys" section
3. Copy your Access Key ID and Secret Access Key
4. Note: These are different from your project's anon key

### 2. Set up Row Level Security (RLS) Policies
Add these policies to your storage bucket for security:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'health-reports');

-- Allow users to read their own files (if using private bucket)
CREATE POLICY "Allow users to read own files" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'health-reports');

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'health-reports');
```

### 3. Environment Variables
Make sure you have these environment variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_REGION=us-east-1
NEXT_PUBLIC_SUPABASE_S3_ACCESS_KEY_ID=your_s3_access_key_id
NEXT_PUBLIC_SUPABASE_S3_SECRET_ACCESS_KEY=your_s3_secret_access_key
```

### 4. Folder Structure
The app will organize files in this structure:
```
health-reports/
├── reports/
│   ├── timestamp-filename.pdf
│   └── timestamp-filename.jpg
└── prescriptions/
    ├── timestamp-filename.pdf
    └── timestamp-filename.jpg
```

## Usage
- Files are uploaded to Supabase Storage using both S3 API and native Supabase API
- The implementation includes fallback methods for reliability
- File names are sanitized and timestamped for uniqueness
- Supported formats: PDF, JPG, JPEG, PNG
- Maximum file size: 5MB

## Troubleshooting
1. **403 Forbidden**: Check RLS policies and user authentication
2. **Bucket not found**: Ensure the bucket `health-reports` exists in your Supabase storage
3. **Upload fails**: Check file size limits and format restrictions
4. **Access denied**: Verify S3 access keys are correct and have proper permissions
5. **Invalid credentials**: Make sure you're using the S3 access keys, not the project anon key
6. **Wrong endpoint**: Verify the endpoint format is `https://PROJECT_ID.supabase.co/storage/v1/s3`
