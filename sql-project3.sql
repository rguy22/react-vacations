create database vacations;

use vacations;

CREATE TABLE vacationsdetails (
id int NOT NULL AUTO_INCREMENT,
description varchar(150),
destenation varchar(50),
picture varchar(150),
dates varchar(50),
price varchar(50),
PRIMARY KEY (id)
);

CREATE TABLE users (
id int NOT NULL AUTO_INCREMENT,
firstName varchar(30),
lastName varchar(30),
userName varchar(30),
password varchar(100),
admin boolean,
 PRIMARY KEY (id)
);

create table followers (
id integer AUTO_INCREMENT,
 vacationID integer,
 userID integer,
 PRIMARY KEY (id)
 );

INSERT INTO vacationsdetails (description, destenation, picture, dates, price)
VALUES ("Magical holiday in Paris", 'Paris', 'https://img.grouponcdn.com/deal/exac1qdg93dgPDr4fLVMZCWUJ9u/ex-2048x1228/v1/c700x420.jpg', '7.10.2019-12.10.2019', '599$' ),
("Great weekend in Rome", 'Rome', 'https://media.triseptsolutions.com/sites/vaxwebuav/PublishingImages/UV_destinations/dest_ROM_thumb2.jpg', '17.12.2019-20.12.2019', '449$' ),
("Relaxing holiday in Thailand", 'Thailand', 'https://dak95nwic4sny.cloudfront.net/73/thailand-40155070-1508147260-ImageGalleryLightboxLarge.jpg', '02.01.2020-23.01.2020', '1009$' );

INSERT INTO users (firstName, lastName, userName , password, admin)
VALUES ("Guy", "Roizman", "admin", '$2b$10$A/hj0Sq42hC3.q8AuddbeekbIQZh7dKsslRrN6uyOJpnfFquERdJq', 1);
-- password: 12345678, user name: admin

