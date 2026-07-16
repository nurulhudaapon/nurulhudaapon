main = do
  -- Available types
  -- Int, Integer, Float, Double, Bool, Char, String, List, Tuple, Maybe, Either, IO, etc.
  let a = 10 -- Int
  let b = 10.0 -- Float
  let c = True -- Bool
  let d = 'a' -- Char
  let e = "Hello" -- String
  let f = [1, 2, 3] -- List
  let g = (1, "Hello") -- Tuple
  let h = Just 10 -- Maybe
  let i = Left 10 -- Either
  let j = Right 10 -- Either
  print a
  print b
  print c
  print d
  print e
  print f
  print g
  print h

  -- #### Maybe ####
  -- This type represents an optional value. It can be either a Just value or Nothing.
  let x = Just 10
  let y = Nothing
  print x

  -- #### Either ####
  -- This type represents a value that can be either a Left value or a Right value. Left value is the error value and Right value is the success value.
  let x = Left "Error"
  let y = Right 10

  -- #### IO ####
  -- This type represents an action that can be performed. It can be either a PutStrLn action or a GetLine action.
  let x = putStrLn "Hello"
  let y = getLine
  print "IO"

  -- #### List ####
  -- This type represents a list of values.
  let x = [1, 2, 3]
  print x

  -- #### Tuple ####
  -- This type represents a tuple of values.
  let x = (1, "Hello")
  print x

  print (double 3)

-- #### Function ####
double :: Integer -> Integer
double x = x * 2