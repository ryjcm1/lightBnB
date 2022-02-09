INSERT INTO users (name, email, password)
VALUES ('Bob Dylan', 'bobdylan5ever@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('John Mayer', 'johntreefolkmayer@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Celion Dion', 'celiondion00@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'); 


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES (1, 'farm', 'description', 'somegenericurl.com', 'covergenericurl.com', 4500, 12, 15, 25, 'USA', 'farmville', 'Kansas City', 'Kansas Province', 142322),
(2, 'john house', 'description', 'somegenericurl.com', 'covergenericurl.com', 3000, 20, 10, 8, 'USA', 'mayerville', 'May City', 'May Province', 231242),
(3, 'Dionisus', 'description', 'somegenericurl.com', 'covergenericurl.com', 10000, 134, 100, 120, 'USA', 'Temple Dion', 'DUH city', 'DUH province', 124234);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2022-01-01', '2022-01-03', 1, 3),
('2022-01-15', '2022-01-17', 2, 1),
('2022-02-01', '2022-02-15', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 1, 5, 'message'),
(1, 2, 2, 5, 'message'),
(2, 3, 3, 5, 'message');