import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToSupabaseStorage } from '@/lib/supabase-storage';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type = data.get('type') as 'report' | 'prescription';
    const title = data.get('title') as string;
    const description = data.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File is too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const uploadResult = await uploadFileToSupabaseStorage(
      file,
      'health-reports',
      type === 'report' ? 'reports' : 'prescriptions'
    );

    if (uploadResult.success) {
      return NextResponse.json({
        success: true,
        filename: file.name,
        url: uploadResult.url,
        type,
        title,
        description,
        uploadedAt: new Date().toISOString(),
        storage: 'supabase'
      });
    } else {
      // If Supabase upload fails, fall back to local storage
      console.log('Supabase upload failed, falling back to local storage:', uploadResult.error);
      
      const fileExt = file.name.split('.').pop();
      const filename = `${uuidv4()}.${fileExt}`;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const path = join(process.cwd(), 'public', 'uploads', filename);
      await writeFile(path, buffer);

      const fileUrl = `/uploads/${filename}`;
      
      return NextResponse.json({
        success: true,
        filename: file.name,
        url: fileUrl,
        type,
        title,
        description,
        uploadedAt: new Date().toISOString(),
        storage: 'local',
        note: `Supabase upload failed: ${uploadResult.error}`
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
