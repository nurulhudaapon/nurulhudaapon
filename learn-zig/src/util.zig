const std = @import("std");

// Functions
pub fn title(comptime fmt: []const u8) void {
    std.debug.print("\n\n\x1b[1;32m➜ {s}:\x1b[0m\n", .{fmt});
}
