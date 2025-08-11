Set up

CREATE TABLE client_tb (
  index SERIAL PRIMARY KEY,
  task varchar(100) NOT NULL,
  finish BOOLEAN default FALSE
);