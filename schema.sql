-- =========================================================================
-- OshSU Dormitory Management System (Jatakana) - Database Schema DDL
-- =========================================================================

-- Custom enums
CREATE TYPE user_role AS ENUM ('student', 'commandant', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE ticket_status AS ENUM ('new', 'in_progress', 'resolved');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'mixed');

-- 1. DORMITORIES
CREATE TABLE public.dormitories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    total_rooms INT NOT NULL,
    total_beds INT NOT NULL,
    available_beds INT NOT NULL,
    description TEXT,
    amenities TEXT[] DEFAULT '{}',
    staff JSONB DEFAULT '[]'::jsonb, -- Store list of personnel: name, role, contacts, photo
    image_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROFILES (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role user_role NOT NULL DEFAULT 'student',
    student_id VARCHAR(50), -- Student ID card number
    gender VARCHAR(10), -- 'male' or 'female'
    faculty VARCHAR(255),
    course INT,
    phone VARCHAR(50),
    managed_dormitory_id UUID REFERENCES public.dormitories(id) ON DELETE SET NULL, -- For commandants
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ROOMS
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dormitory_id UUID REFERENCES public.dormitories(id) ON DELETE CASCADE NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity IN (2, 4)),
    gender_allowed gender_type NOT NULL DEFAULT 'mixed',
    occupied_beds INT DEFAULT 0 CHECK (occupied_beds <= capacity),
    floor INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (dormitory_id, room_number)
);

-- 4. APPLICATIONS
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    dormitory_id UUID REFERENCES public.dormitories(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    status application_status NOT NULL DEFAULT 'pending',
    personal_data JSONB NOT NULL, -- Cache of registration details: full_name, faculty, course, gender, etc.
    documents JSONB NOT NULL, -- Private document URLs: photo3x4, fluorography, character_reference
    benefits TEXT[] DEFAULT '{}', -- List of benefits claimed: orphan, disabled, low_income, etc.
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    comment TEXT, -- Optional reject reason or commandant's feedback
    contract_pdf_url VARCHAR(512), -- Generated PDF agreement
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. MAINTENANCE TICKETS
CREATE TABLE public.maintenance_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    dormitory_id UUID REFERENCES public.dormitories(id) ON DELETE CASCADE NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'electrical', 'plumbing', 'furniture', 'other'
    status ticket_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dormitories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;

-- Helper functions to determine role/dormitory to avoid recursive policy calls
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_commandant_dormitory(user_id UUID)
RETURNS UUID AS $$
  SELECT managed_dormitory_id FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- PROFILES POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own basic profile fields"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = public.get_user_role(auth.uid())
);

-- -------------------------------------------------------------------------
-- DORMITORIES POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Dormitories are viewable by anyone"
ON public.dormitories FOR SELECT TO public
USING (true);

CREATE POLICY "Admins can modify dormitories"
ON public.dormitories FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- -------------------------------------------------------------------------
-- ROOMS POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Rooms are viewable by authenticated users"
ON public.rooms FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Commandants and Admins can modify rooms"
ON public.rooms FOR ALL TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'admin' OR 
  (public.get_user_role(auth.uid()) = 'commandant' AND dormitory_id = public.get_commandant_dormitory(auth.uid()))
);

-- -------------------------------------------------------------------------
-- APPLICATIONS POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Students can view own applications"
ON public.applications FOR SELECT TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Students can insert own applications"
ON public.applications FOR INSERT TO authenticated
WITH CHECK (
  student_id = auth.uid() 
  AND status = 'pending'::application_status
  AND payment_status = 'unpaid'::payment_status
  AND room_id IS NULL
  AND contract_pdf_url IS NULL
);

CREATE POLICY "Commandants can view and manage applications for their dormitory"
ON public.applications FOR ALL TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'commandant' AND 
  dormitory_id = public.get_commandant_dormitory(auth.uid())
);

CREATE POLICY "Admins can view and manage all applications"
ON public.applications FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- -------------------------------------------------------------------------
-- MAINTENANCE TICKETS POLICIES
-- -------------------------------------------------------------------------
CREATE POLICY "Students can view and manage their own tickets"
ON public.maintenance_tickets FOR ALL TO authenticated
USING (student_id = auth.uid());

CREATE POLICY "Commandants can view and manage tickets for their dormitory"
ON public.maintenance_tickets FOR ALL TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'commandant' AND 
  dormitory_id = public.get_commandant_dormitory(auth.uid())
);

CREATE POLICY "Admins can view and manage all tickets"
ON public.maintenance_tickets FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- -------------------------------------------------------------------------
-- AUTH SYNC TRIGGER
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'student'::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
