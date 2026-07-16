main = do
  -- Basic
  putStrLn "PutStrLn - Hello Nurul"
  print "Print - Hello Nurul"

  -- Interpolated
  putStrLn ("PutStrLn - Hello " ++ "Nurul")
  let name = "Nurul"
  putStrLn ("PutStrLn - Hello " ++ name)
  print ("Print - Hello " ++ name)
  let age = 20
  print ("Print - Age: " ++ show age)
