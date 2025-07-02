-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see bookings where they are the billing_email
CREATE POLICY "Users can view their own billing bookings" ON bookings
  FOR SELECT
  USING (billing_email = auth.jwt() ->> 'email');

-- Policy to allow users to see bookings where they are the attendee_email
CREATE POLICY "Users can view their own attendee bookings" ON bookings
  FOR SELECT
  USING (attendee_email = auth.jwt() ->> 'email');

-- Policy to allow authenticated users to insert bookings
CREATE POLICY "Authenticated users can insert bookings" ON bookings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow users to update their own bookings
CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE
  USING (billing_email = auth.jwt() ->> 'email' OR attendee_email = auth.jwt() ->> 'email'); 