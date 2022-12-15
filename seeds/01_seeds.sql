INSERT INTO users (name,email,password)
VALUES ('Bianca Fu', 'biancafu@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dhrish Fu', 'dhrishamin@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dylan Fu', 'dylanfu@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'sweet warm house', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 200, 3, 3, 4,'Canada', '105st NW', 'Vancouver', 'BC', 'V3K 2M5', true),
(2, 'cool modern house', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 200, 3, 3, 4,'Canada', '105st NW', 'Vancouver', 'BC', 'V3K 2M5', true),
(2, 'vacation house', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 350, 5, 5, 3,'Canada', '105st NW', 'Vancouver', 'BC', 'V3K 2M5', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id) 
VALUES ('2022-12-23','2022-12-28',3,3),
('2023-2-1','2023-2-15',1,2),
('2023-4-13','2023-4-28',2,2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating)
VALUES (3,3,1,5),
(2,1,2,5),
(2,2,3,4);