main = do
    let p1 = Person "Nurul" 12

    print (greet p1)

greet :: Person -> String
greet person = "Hi " ++ name person ++ " with ID: " ++ show (student_id person)

-- | Score represents a student's score with an ID and numeric score
-- The first parameter is the student ID (String)
-- The second parameter is their numeric score (Int)
data Person = Person {
    name :: String,
    student_id :: Int
}

-- Accessing field of record is just by the field named followed by the var name
-- field_name obj
-- name personObj