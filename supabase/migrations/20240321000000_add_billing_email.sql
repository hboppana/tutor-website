-- Add billing_email column to existing bookings table
ALTER TABLE bookings ADD COLUMN billing_email TEXT;

-- Update existing records to use attendee_email as billing_email
UPDATE bookings SET billing_email = attendee_email WHERE billing_email IS NULL;

-- Make billing_email NOT NULL after populating existing records
ALTER TABLE bookings ALTER COLUMN billing_email SET NOT NULL;

-- Create index for billing_email
CREATE INDEX IF NOT EXISTS idx_billing_email ON bookings(billing_email); 