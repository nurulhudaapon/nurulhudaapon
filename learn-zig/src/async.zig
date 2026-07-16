const std = @import("std");

pub fn main(init: std.process.Init) !void {
    const io = init.io;

    // Concurrent
    var c1 = try io.concurrent(getAccount, .{ io, 1 });
    defer _ = c1.cancel(io);

    var c2 = try io.concurrent(getAccount, .{ io, 2 });
    defer _ = c2.cancel(io);

    // Async
    var a1 = io.async(getAccount, .{ io, 3 });
    defer _ = a1.cancel(io);

    var a2 = io.async(getAccount, .{ io, 4 });
    defer _ = a2.cancel(io);

    // Both calls were already running asynchronously out of order, now we await until they complete
    const cr1 = c1.await(io);
    const cr2 = c2.await(io);
    std.log.info("Concurrent Results: {any}, {any}", .{ cr1, cr2 });

    // Both call will run synchronously each blocking until result comes in
    const br1 = getAccount(io, 1);
    const br2 = getAccount(io, 2);
    std.log.info("Blocking Results: {any}, {any}", .{ br1, br2 });

    // Both calls were already running concurrently in multiple core at same time, now we await until they complete
    const ar1 = a1.await(io);
    const ar2 = a2.await(io);
    std.log.info("Async Results: {any}, {any}", .{ ar1, ar2 });
}

const Account = struct { id: u32 };

fn getAccount(io: std.Io, id: u32) Account {
    io.sleep(.fromSeconds(1), .awake) catch {};

    return Account{ .id = id };
}
