-- ============================================
-- Seed data: Hulhumalé Sports Facilities
-- ============================================

INSERT INTO facilities (name, neighborhood, sport_type, description, capacity, slot_duration_min, price_per_slot, operating_start, operating_end, status) VALUES

-- Football facilities
('Hulhumalé Football Ground 1', 'Phase 1', 'Football', 'Full-size football pitch with natural grass surface. Floodlights available for evening matches. Changing rooms and seating for 200 spectators.', 30, 90, 500.00, '06:00', '23:00', 'active'),
('Hulhumalé Football Ground 2', 'Phase 2', 'Football', 'FIFA-standard synthetic turf pitch. Ideal for competitive matches and training sessions. Includes scoreboards and PA system.', 30, 90, 600.00, '06:00', '23:00', 'active'),
('Hulhumalé Futsal Court', 'Central Park', 'Futsal', 'Indoor futsal court with professional-grade flooring. Air-conditioned facility with spectator gallery.', 14, 60, 400.00, '06:00', '23:00', 'active'),

-- Cricket facilities
('Hulhumalé Cricket Ground', 'Phase 1', 'Cricket', 'Standard cricket ground with turf pitch and practice nets. Pavilion with seating capacity of 150.', 26, 120, 750.00, '06:00', '23:00', 'active'),

-- Basketball facilities
('Hulhumalé Basketball Court - Outdoor', 'Phase 1', 'Basketball', 'Outdoor full-size basketball court with acrylic surface. Floodlights for evening play.', 12, 60, 300.00, '06:00', '23:00', 'active'),
('Hulhumalé Indoor Basketball Court', 'Phase 2', 'Basketball', 'Indoor air-conditioned basketball court with wooden flooring. Electronic scoreboard and seating for 100.', 12, 60, 450.00, '06:00', '23:00', 'active'),

-- Badminton facilities
('Hulhumalé Badminton Hall', 'Phase 1', 'Badminton', 'Four-court indoor badminton hall with BWF-approved flooring. Proper lighting and ventilation.', 8, 60, 200.00, '06:00', '23:00', 'active'),

-- Volleyball facilities
('Hulhumalé Beach Volleyball Court', 'Beach Area', 'Volleyball', 'Regulation beach volleyball court with imported sand. Nets and boundary markers provided. Located near the beachfront.', 12, 60, 250.00, '06:00', '23:00', 'active'),
('Hulhumalé Indoor Volleyball Court', 'Phase 2', 'Volleyball', 'Indoor volleyball court with sprung wooden floor. Suitable for competitive matches.', 14, 60, 350.00, '06:00', '23:00', 'active'),

-- Tennis facilities
('Hulhumalé Tennis Court 1', 'Phase 1', 'Tennis', 'Hard-court tennis surface with floodlights. Equipment rental available at reception.', 4, 60, 300.00, '06:00', '23:00', 'active'),
('Hulhumalé Tennis Court 2', 'Phase 1', 'Tennis', 'Hard-court tennis surface adjacent to Court 1. Can be booked together for tournaments.', 4, 60, 300.00, '06:00', '23:00', 'active'),

-- Table Tennis
('Hulhumalé Table Tennis Hall', 'Central Park', 'Table Tennis', 'Indoor hall with six competition-grade table tennis tables. Air-conditioned with proper lighting.', 12, 60, 150.00, '06:00', '23:00', 'active'),

-- Swimming
('Hulhumalé Swimming Pool', 'Phase 2', 'Swimming', '25-meter lap pool with six lanes. Separate children''s pool. Changing facilities and lifeguard on duty.', 30, 60, 500.00, '06:00', '21:00', 'active'),

-- Multi-purpose
('Hulhumalé Community Sports Hall', 'Phase 1', 'Multi-purpose', 'Large indoor sports hall suitable for handball, indoor football, and events. 800 sqm floor space with retractable seating.', 40, 120, 800.00, '06:00', '23:00', 'active');

-- Seed initial guideline
INSERT INTO guidelines (version, content, is_current) VALUES
('v1.0', '# HDC Sports Facility Usage Guidelines

## General Rules
1. All users must check in at the facility reception before use.
2. Appropriate sports attire and footwear must be worn at all times.
3. No smoking, alcohol, or illegal substances on facility premises.
4. Users are responsible for any damage caused to facility equipment or property.
5. All personal belongings are brought at the owner''s risk.

## Booking Rules
1. Bookings must be made through the HDC Sports app.
2. Teams must arrive within 15 minutes of their booked start time, or the slot may be forfeited.
3. Cancellations must be made at least 24 hours in advance for a full refund.
4. No-shows will be charged the full booking fee.

## Facility Care
1. Clean up after use — remove all trash and personal items.
2. Report any damage or maintenance issues to facility staff immediately.
3. Do not move or rearrange permanent equipment without staff approval.
4. Respect other users and maintain acceptable noise levels.

## Safety
1. Follow all posted safety signs and instructions.
2. First aid kits are available at each facility reception.
3. In case of emergency, contact facility staff or call emergency services.
4. Children under 12 must be accompanied by an adult at all times.

## Violations
Repeated violation of these guidelines may result in:
- Temporary suspension of booking privileges
- Permanent ban from HDC sports facilities
- Financial liability for damages

*Last updated: March 2026*', true);
