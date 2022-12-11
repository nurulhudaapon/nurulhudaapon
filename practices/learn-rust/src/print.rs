pub fn run() {
    // Print to console
    println!("Hello from the print.rs file");

    // Basic Formatting
    println!("Hello {}!", "Nurul");

    // Positional Arguments
    println!("Hello {0}! {0} loves learning to {1}", "Nurul", "code");

    // Named Arguments
    println!("{name} likes to play {activity}", name = "John", activity = "Baseball");

    // Placeholder traits
    println!("Binary: {:b} Hex: {:x} Octal: {:o}", 10, 10, 10);

    // Placeholder for debug trait
    println!("{:?}", (12, true, "hello"));

    // Basic math
    println!("10 + 10 = {}", 10 + 10);
}