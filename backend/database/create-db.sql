-- creating database for the project

-- source C:/Users/ellir/Hybridisovellukset/TravelTime/backend/database/create-db.sql;

DROP DATABASE IF EXISTS traveltime;
CREATE DATABASE traveltime;
USE traveltime;

-- create user levels

CREATE TABLE UserLevels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

-- users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_level_id INT,
    profile_picture VARCHAR(255) DEFAULT 'defaultprofile.png',
    profile_info VARCHAR(150) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id) ON DELETE CASCADE
);

-- tags table
CREATE TABLE Tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE
);

-- posts table
CREATE TABLE TravelPosts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- reference to users table
    filename VARCHAR(255) NOT NULL, -- filename of the media
    media_type VARCHAR(50) NOT NULL, -- type of the media, either image or video
    continent VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- postTags table
CREATE TABLE PostTags (
    post_tag_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL, -- reference to travelPosts table
    tag_id INT NOT NULL, -- reference to tags table
    FOREIGN KEY (post_id) REFERENCES TravelPosts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE,
    UNIQUE (post_id, tag_id) -- post can have a tag only once
);

-- likes table
CREATE TABLE Likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES TravelPosts(post_id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id) -- user can like a post only once
);

-- comments table
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    comment_text VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES TravelPosts(post_id) ON DELETE CASCADE
);

-- follows table
CREATE TABLE Follows (
    follow_id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT,
    following_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (follower_id, following_id) -- user can follow another user only once
);

-- Indexes for faster search

CREATE INDEX idx_city ON TravelPosts(city);
CREATE INDEX idx_country ON TravelPosts(country);
CREATE INDEX idx_continent ON TravelPosts(continent);
CREATE INDEX idx_tag_name ON Tags(tag_name);

CREATE INDEX idx_created_at_post ON TravelPosts(created_at);

-- indexes for foreign keys

CREATE INDEX idx_user_id_posts ON TravelPosts(user_id); -- for user_id in travelPosts table
CREATE INDEX idx_post_id_comments ON Comments(post_id); -- for comments on specific post
CREATE INDEX idx_user_id_likes ON Likes(user_id); -- for likes by specific user
CREATE INDEX idx_post_id_likes ON Likes(post_id);
CREATE INDEX idx_follower_id_follows ON Follows(follower_id); -- for followers lookup

-- index to join posts and tags

CREATE INDEX idx_post_id_post_tags ON PostTags(post_id);

CREATE INDEX idx_created_at_comments ON Comments(created_at);

-- Inserting data

INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User'), ('Guest');

-- views 

-- a view that joins the trips and tags tables, showing all trips along with their associated tags

CREATE VIEW post_tags_view AS
SELECT 
    TravelPosts.post_id,
    TravelPosts.filename,
    TravelPosts.media_type,
    TravelPosts.continent,
    TravelPosts.country,
    TravelPosts.city,
    TravelPosts.start_date,
    TravelPosts.end_date,
    TravelPosts.description,
    TravelPosts.created_at,
    GROUP_CONCAT(Tags.tag_name) AS Tags
FROM TravelPosts
LEFT JOIN PostTags ON TravelPosts.post_id = PostTags.post_id
LEFT JOIN Tags ON PostTags.tag_id = Tags.tag_id
GROUP BY TravelPosts.post_id;

CREATE VIEW user_followings AS
SELECT u.username, f.created_at, f.follower_id, f.following_id
FROM Users u
JOIN Follows f ON u.user_id = f.following_id;

CREATE VIEW user_likes AS
SELECT u.username, l.created_at, l.user_id, l.post_id
FROM Users u
JOIN Likes l ON u.user_id = l.user_id;
