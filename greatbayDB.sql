DROP DATABASE IF EXISTS productDB;

CREATE DATABASE productDB;

USE productDB;

CREATE TABLE product (
  id INT NOT NULL AUTO_INCREMENT,
  productname VARCHAR(55) NOT NULL,
  category VARCHAR(55) NOT NULL,
  startBid INT(30) NOT NULL, 
  bid INT (30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE users(
  id INTEGER(30) AUTO_INCREMENT NOT NULL,
  user VARCHAR(100),
  PRIMARY KEY (id)
);

INSERT INTO products (productname, category, startBid)
VALUES ('books', 'item', 75);