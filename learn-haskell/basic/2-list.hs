main = do
  -- List of Integer
  let intList = [1, 2, 3]

  print intList

  let emptyList = []

  putStrLn ("List: " ++ show intList)
  putStrLn ("Head: " ++ show (head intList))
  putStrLn ("Tail: " ++ show (tail intList))
  putStrLn ("Length: " ++ show (length intList))
  putStrLn ("Is Empty: " ++ show (null intList))
  putStrLn ("Is Empty: " ++ show (null emptyList))
  putStrLn ("Asc: " ++ show (asc intList))
  putStrLn ("Double: " ++ show (doubleList intList))

  putStrLn ("AND: " ++ show (and (boolify [1, 1, 1])))

  putStrLn ("Element Exist: " ++ show (elmExist 1 [0, 1, 2]))
  putStrLn ("Element Exist: " ++ show (elmExist 3 [0, 1, 2]))
  putStrLn ("Element Exist: " ++ show (elmExist 3 []))

  putStrLn ("Dedupe: " ++ show (dedupe [1, 1, 1, 1, 1, 1, 1]))
  putStrLn ("Dedupe: " ++ show (dedupe [1, 1, 1, 1, 1, 1, 1, 3, 21]))
  putStrLn ("Dedupe: " ++ show (dedupe [1, 2, 3, 4, 4]))

  putStrLn ("isAsc: " ++ show (isAsc [1, 1, 1, 1, 1, 1, 1]))
  putStrLn ("isAsc: " ++ show (isAsc [1, 1, 1, 1, 1, 1, 1, 3, 21]))
  putStrLn ("isAsc: " ++ show (isAsc [4, 2, 3, 4, 4]))

asc list = list

doubleList = map (* 2)

boolify list = [x == 1 | x <- list]

elmExist :: (Eq a) => a -> [a] -> Bool
elmExist _ [] = False
elmExist item (x : xs) = (x == item) || elmExist item xs

dedupe :: [Integer] -> [Integer]
dedupe [] = []
dedupe (x : xs)
  | elmExist x xs = dedupe xs
  | otherwise = x : dedupe xs

isAsc :: [Int] -> Bool
isAsc [] = False
isAsc [x] = True
-- isAsc (x : xs)
--   | null xs = True
--   | x > head xs = False
--   | otherwise = isAsc xs
isAsc (x : y : xs) = x <= y && isAsc (y : xs)

hasPath :: [(Int, Int)] -> Int -> Int -> Bool
hasPath [] source dest = source == dest
-- Incomplete
hasPath nodes source dest
  | source == dest = True
  | otherwise = False