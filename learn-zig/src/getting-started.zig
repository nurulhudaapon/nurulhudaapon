const std = @import("std");

// Printing
pub fn main() void {
    std.debug.print("Hello {s}!\n", .{"Nurul"});
}

// Testing
const expect = std.testing.expect;

test "Passing Test" {
    try expect(true);
}

test "Passing Test 2" {
    try expect(true);
}

test "Failing Test" {
    try expect(false);
}
