-- Create bookings table
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cal_booking_id TEXT NOT NULL UNIQUE,
    event_type TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER,
    organizer_name TEXT NOT NULL,
    organizer_email TEXT NOT NULL,
    organizer_timezone TEXT NOT NULL,
    attendee_name TEXT NOT NULL,
    attendee_email TEXT NOT NULL,
    attendee_timezone TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled', 'rescheduled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_cal_booking_id ON bookings(cal_booking_id);
CREATE INDEX idx_organizer_email ON bookings(organizer_email);
CREATE INDEX idx_attendee_email ON bookings(attendee_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 