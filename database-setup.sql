-- Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    blood_group TEXT,
    contact_number TEXT,
    email TEXT NOT NULL,
    address TEXT,
    patient_id TEXT UNIQUE,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relationship TEXT,
    medical_history TEXT,
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON public.patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy: Users can only see their own patient profile
CREATE POLICY "Users can view own patient profile" ON public.patients
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own patient profile
CREATE POLICY "Users can insert own patient profile" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own patient profile
CREATE POLICY "Users can update own patient profile" ON public.patients
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own patient profile
CREATE POLICY "Users can delete own patient profile" ON public.patients
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON public.patients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO public.patients (user_id, full_name, age, gender, blood_group, contact_number, email, address, patient_id)
-- VALUES 
--     ('00000000-0000-0000-0000-000000000001', 'John Doe', 39, 'Male', 'O+', '123-456-7890', 'john.doe@example.com', '123 Main St, Springfield, USA', 'PAT001'),
--     ('00000000-0000-0000-0000-000000000002', 'Jane Smith', 28, 'Female', 'A-', '098-765-4321', 'jane.smith@example.com', '456 Oak Ave, Springfield, USA', 'PAT002');
