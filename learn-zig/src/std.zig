const util = @import("util.zig");
const std = @import("std");
const expect = std.testing.expect;
const eql = std.mem.eql;

pub fn main() void {
    util.title("Filesystem");
}

test "fs reading file" {
    const file = try std.fs.cwd().openFile("./../README.md", .{});

    defer file.close();

    var content: [500]u8 = undefined;
    try file.seekTo(0);
    const bytes_read = try file.readAll(&content);
    std.debug.print("Byetes: {}", .{bytes_read});
    // std.debug.print("Content: {s}", .{content[0..bytes_read]});
    try expect(bytes_read > 0);
}

test "createFile, write, seekTo, read" {
    const file = try std.fs.cwd().createFile(
        "junk_file.txt",
        .{ .read = true },
    );
    defer file.close();

    try file.writeAll("Hello File!");

    var buffer: [100]u8 = undefined;
    try file.seekTo(0);
    const bytes_read = try file.readAll(&buffer);

    try expect(eql(u8, buffer[0..bytes_read], "Hello File!"));
    try std.fs.cwd().deleteFile("junk_file.txt");
}

test "file stat" {
    const file = try std.fs.cwd().createFile(
        "junk_file2.txt",
        .{ .read = true },
    );
    defer file.close();
    const stat = try file.stat();
    try expect(stat.size == 0);
    try expect(stat.kind == .file);
    // try expect(stat.ctime <= std.time.nanoTimestamp());
    // try expect(stat.mtime <= std.time.nanoTimestamp());
    // try expect(stat.atime <= std.time.nanoTimestamp());
    try std.fs.cwd().deleteFile("junk_file2.txt");
}

test "list all files" {
    var files = try std.fs.cwd().openDir(".", .{ .iterate = true });
    var iter = files.iterate();

    while (try iter.next()) |entry| {
        std.debug.print("\nFile: {s}\n", .{entry.name});
    }
}
