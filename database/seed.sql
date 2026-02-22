-- Sample data for testing the barber appointment system
-- Only run this AFTER applying schema.sql

-- Clears existing data and resets ID sequences 
TRUNCATE TABLE appointments, availability_blocks, users RESTART IDENTITY CASCADE;

-- Create a barber (admin user)
-- Email: barber.tom@example.com, Password: password123
INSERT INTO users (email, password_hash, role)
VALUES ('barber.tom@example.com', '$2b$14$T/CVagtwqe3n1qR00WsdEOgd891I7twTQbO0s0sknKzliOE2Wf/KC', 'admin');

-- Create sample customers
-- Email: customer1@example.com, Password: customer1password
INSERT INTO users (email, password_hash, role)
VALUES ('customer1@example.com', '$2b$14$VVI1qHFz7eW7CWqCixXew.Jn4YuFiOV7sO/mEi8D6lHPkTWUnaLLK', 'customer');

-- Email: customer2@example.com, Password: customer2password
INSERT INTO users (email, password_hash, role)
VALUES ('customer2@example.com', '$2b$14$CIwnHZSIXC9Wi5hGa5l.y.kAldNgvk6p71Ll1IclRJXJv7N1/UJV2', 'customer');

-- Email: customer3@example.com, Password: customer3password
INSERT INTO users (email, password_hash, role)
VALUES ('customer3@example.com', '$2b$14$6Y/M9/P2XweHPw0MRzqLJuay1BCFI7a0RCSDduaRUyr2iISM59yfy', 'customer');

-- Create availability blocks for the barber (assumes barber has id = 1)
INSERT INTO availability_blocks (barber_id, start_time, end_time)
VALUES 
    (1, '2026-02-16 11:00:00-05', '2026-02-16 17:00:00-05'),
    (1, '2026-02-17 11:00:00-05', '2026-02-17 17:00:00-05'),
    (1, '2026-02-18 11:00:00-05', '2026-02-18 17:00:00-05'),
    (1, '2026-02-19 11:00:00-05', '2026-02-19 17:00:00-05'),
    (1, '2026-02-20 11:00:00-05', '2026-02-20 17:00:00-05');

-- Create sample appointments
INSERT INTO appointments (barber_id, customer_id, start_time, end_time, status)
VALUES 
    (1, 2, '2026-02-16 11:00:00-05', '2026-02-16 11:45:00-05', 'booked'),
    (1, 3, '2026-02-17 12:00:00-05', '2026-02-17 12:45:00-05', 'booked'),
    (1, 4, '2026-02-18 13:30:00-05', '2026-02-18 14:15:00-05', 'booked');