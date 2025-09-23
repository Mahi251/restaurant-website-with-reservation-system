-- Fixed to use reservation_date instead of date to avoid conflicts
-- Create reservations table if it doesn't exist
CREATE TABLE IF NOT EXISTS reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0),
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on reservation_date and reservation_time for faster queries
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, reservation_time);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- Enable RLS (Row Level Security)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for reservations
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON reservations FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable insert for all users" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Enable update for all users" ON reservations FOR UPDATE USING (true);
CREATE POLICY IF NOT EXISTS "Enable delete for all users" ON reservations FOR DELETE USING (true);
