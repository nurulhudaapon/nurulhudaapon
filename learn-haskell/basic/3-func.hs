import GHC.Float (powerFloat)
printName :: Int -> String -> IO()
printName age name = do
    let age = 3
    putStrLn ( name ++ ", age: " ++ show age)



calcBmi height weight =
    weight / ((height/100)^2)

inchToCm inch = inch * 2.54

main = do
    -- putStr "Name: "
    -- name <- getLine
    -- putStr "Age: "
    -- age <- getLine

    -- let bmi = calcBmi  (inchToCm 63.0) 55.0

    -- putStrLn ("Hi " ++ name ++ ", your BMI is " ++ show bmi)


    -- Anon Function
    let dbl = \a -> a * 2
    let shortDbl = (* 2)

    print (dbl 3)
    print (shortDbl 3)

    -- Passing Lambda Func
    let testList = [-3, -4, 2, 3, 4]
    let add1 = map (\a -> a + 1) [1, 2, 3]
    let calArr = map (\a -> a + 1 + a^2) [1, 2, 3]
    let posOnly = filter (\a -> a > 0) testList
    let negOnly = filter (< 0) testList

    print add1
    print calArr
    print posOnly
    print negOnly