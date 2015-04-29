#use

CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  middle_name varchar(100) NOT NULL,
  department_id int(11) NOT NULL,
  job varchar(100) NOT NULL,
  birthday date NOT NULL,
  birthplace varchar(255) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_users_department_id FOREIGN KEY (department_id)
  REFERENCES department (id) ON DELETE NO ACTION ON UPDATE NO ACTION
)

CREATE TABLE department (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  PRIMARY KEY (id)
)

SET NAMES 'utf8';

INSERT INTO backbone.users(id, first_name, last_name, middle_name, department_id, job, birthday, birthplace) VALUES
(1, 'Админ', 'Админов', 'Админович', 7, 'Администратор', '2006-07-28', 'Россия, г. Калуга');

INSERT INTO backbone.department(id, name) VALUES
(1, 'Коммерческий отдел');
INSERT INTO backbone.department(id, name) VALUES
(2, 'Юридический отдел');
INSERT INTO backbone.department(id, name) VALUES
(4, 'Финансовый отдел');
INSERT INTO backbone.department(id, name) VALUES
(5, 'Отдел маркетинга');
INSERT INTO backbone.department(id, name) VALUES
(6, 'Отдел кадров');
INSERT INTO backbone.department(id, name) VALUES
(7, 'Отдел безопасности');
INSERT INTO backbone.department(id, name) VALUES
(8, 'Транспортный отдел');
INSERT INTO backbone.department(id, name) VALUES
(9, 'Отдел МТС');
