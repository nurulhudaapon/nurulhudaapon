main = do
    let nurul_score = Score "23" 5
    putStrLn ("Student ID: " ++ show (getStudentId nurul_score) ++ ", Score: " ++ show (getScore nurul_score))

-- Helper functions to get Score components
getStudentId :: Score -> String  
getStudentId (Score id _) = id

getScore :: Score -> Int
getScore (Score _ score) = score


-- | Score represents a student's score with an ID and numeric score
-- The first parameter is the student ID (String)
-- The second parameter is their numeric score (Int)
data Score = Score String Int