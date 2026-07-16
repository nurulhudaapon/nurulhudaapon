-- db database
CREATE DATABASE IF NOT EXISTS db;

-- user table
CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_submission_at TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
);

-- user_profile table
CREATE TABLE IF NOT EXISTS user_profile (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- code table
CREATE TABLE IF NOT EXISTS code (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    algorithm VARCHAR(255) NOT NULL,
    variation VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- code_performance table
CREATE TABLE IF NOT EXISTS code_performance (
    id INT NOT NULL AUTO_INCREMENT,
    code_id INT NOT NULL,
    time INT NOT NULL,
    memory INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (code_id) REFERENCES code(id)
);

-- trigger to update last_submission_at
-- DELIMITER //
-- CREATE TRIGGER IF NOT EXISTS update_last_submission_at
-- AFTER INSERT ON code
-- FOR EACH ROW
-- BEGIN
--     UPDATE user SET last_submission_at = NEW.created_at WHERE id = NEW.user_id;
-- END//
-- DELIMITER ;