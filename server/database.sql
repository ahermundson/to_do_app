CREATE DATABASE todo;

CREATE TABLE tasks (
id SERIAL PRIMARY KEY,
task VARCHAR(100),
complete VARCHAR(20));
