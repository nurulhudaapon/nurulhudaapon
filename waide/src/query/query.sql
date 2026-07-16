-- create_user:
INSERT INTO user (email, password) VALUES (?, ?);
INSERT INTO user_profile (first_name, last_name, user_id) VALUES (?, ?, LAST_INSERT_ID());

-- login_user:
SELECT * FROM user WHERE email = ?;

-- get_user_list:
SELECT
    u.id,
    u.username,
    u.email,
    u.created_at,
    u.updated_at,
    up.first_name,
    up.last_name,
    c.algorithm,
    c.variation,
    c.code,
    cp.time,
    cp.memory
FROM user u
LEFT JOIN user_profile up ON u.id = up.user_id
LEFT JOIN code c ON u.id = c.user_id
LEFT JOIN code_performance cp ON c.id = cp.code_id

-- create_code:
INSERT INTO code (user_id, algorithm, variation, code, slug) VALUES (?, ?, ?, ?, ?);

-- get_code_list:
SELECT
    c.id,
    c.algorithm,
    c.variation,
    c.code,
    cp.time,
    cp.memory,
    u.id AS user_id,
    u.email,
    up.first_name,
    up.last_name
FROM code c
LEFT JOIN code_performance cp ON c.id = cp.code_id
LEFT JOIN user u ON c.user_id = u.id
LEFT JOIN user_profile up ON u.id = up.user_id

-- get_code_list_by_slug:
SELECT
    c.id,
    c.algorithm,
    c.variation,
    c.code,
    cp.time,
    cp.memory
FROM code c
LEFT JOIN code_performance cp ON c.id = cp.code_id
WHERE c.slug = ?

-- update_code:
UPDATE code SET code = ? WHERE id = ?;

-- delete_code:
DELETE FROM code WHERE id = ?;

-- update_user_profile:
UPDATE user_profile SET first_name = ?, last_name = ? WHERE user_id = ?;

-- get_code:
SELECT
    c.id,
    c.algorithm,
    c.variation,
    c.code,
    cp.time,
    cp.memory
FROM code c
LEFT JOIN code_performance cp ON c.id = cp.code_id
WHERE c.id = ?

-- create_code_performance:
INSERT INTO code_performance (code_id, time, memory) VALUES (?, ?, ?);

-- get_algorithm_list:
SELECT DISTINCT algorithm, slug, variation FROM code;

-- get_algorithm_performance_list:
SELECT DISTINCT
    c.algorithm,
    c.variation,
    AVG(cp.time) AS time,
    AVG(cp.memory) AS memory
FROM code c
LEFT JOIN code_performance cp ON c.id = cp.code_id
GROUP BY c.algorithm, c.variation;

-- get_top_performing_algorithms_by_slug:
SELECT
    c.algorithm,
    c.variation,
    cp.time,
    cp.memory
FROM code c
LEFT JOIN code_performance cp ON c.id = cp.code_id
WHERE c.slug = ?

-- get_algorithm_variation_list:
SELECT
    DISTINCT variation
FROM
    (
        SELECT
            variation,
            time,
            memory
        FROM
            code
            LEFT JOIN code_performance cp ON code.id = cp.code_id
        WHERE slug = ?
        ORDER BY
            cp.time ASC,
            cp.memory ASC
    ) t;