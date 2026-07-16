const std = @import("std");
const zx = @import("zx");

pub fn build(b: *std.Build) !void {
    // --- Target and Optimize from `zig build` arguments ---
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});
    const build_mcp = b.option(bool, "mcp", "Build the MCP server executable") orelse false;

    // --- Root Module ---
    const mod = b.addModule("root_mod", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });

    // --- ZX Setup (sets up ZX, dependencies, executables and `serve` step) ---
    const site_exe = b.addExecutable(.{
        .name = "zx_site",
        .root_module = b.createModule(.{
            .root_source_file = b.path("site/main.zig"),
            .target = target,
            .optimize = optimize,
            .imports = &.{
                .{ .name = "root_mod", .module = mod },
            },
        }),
    });

    _ = try zx.init(b, site_exe, .{
        .experimental = .{ .enabled_csr = true },
    });

    // --- MCP Exe (only built with -Dmcp) --- //
    if (build_mcp) {
        const mcp_mod = b.addModule("mcp_mod", .{
            .root_source_file = b.path("src/mcp.zig"),
            .target = target,
            .optimize = optimize,
        });

        const mcp_exe = b.addExecutable(.{
            .name = "whatsz_mcp",
            .root_module = b.createModule(.{
                .root_source_file = b.path("src/main.zig"),
                .target = target,
                .optimize = optimize,
                .imports = &.{
                    .{ .name = "mcp_mod", .module = mcp_mod },
                },
            }),
        });

        const zqlite = b.dependency("zqlite", .{
            .target = target,
            .optimize = optimize,
        });

        mcp_exe.addCSourceFile(.{
            .file = b.path("lib/sqlite/sqlite3.c"),
            .flags = &[_][]const u8{
                "-DSQLITE_DQS=0",
                "-DSQLITE_DEFAULT_WAL_SYNCHRONOUS=1",
                "-DSQLITE_USE_ALLOCA=1",
                "-DSQLITE_THREADSAFE=1",
                "-DSQLITE_TEMP_STORE=3",
                "-DSQLITE_ENABLE_API_ARMOR=1",
                "-DSQLITE_ENABLE_UNLOCK_NOTIFY",
                "-DSQLITE_DEFAULT_FILE_PERMISSIONS=0600",
                "-DSQLITE_OMIT_DECLTYPE=1",
                "-DSQLITE_OMIT_DEPRECATED=1",
                "-DSQLITE_OMIT_LOAD_EXTENSION=1",
                "-DSQLITE_OMIT_PROGRESS_CALLBACK=1",
                "-DSQLITE_OMIT_SHARED_CACHE",
                "-DSQLITE_OMIT_TRACE=1",
                "-DSQLITE_OMIT_UTF16=1",
                "-DHAVE_USLEEP=0",
            },
        });
        mcp_exe.linkLibC();
        mcp_exe.root_module.addImport("zqlite", zqlite.module("zqlite"));

        const mcp_lib_dep = b.dependency("mcp", .{
            .target = target,
            .optimize = optimize,
        });

        mcp_exe.root_module.addImport("mcp", mcp_lib_dep.module("mcp"));

        b.installArtifact(mcp_exe);
        const run_mcp = b.addRunArtifact(mcp_exe);
        run_mcp.step.dependOn(b.getInstallStep());
        if (b.args) |args| {
            run_mcp.addArgs(args);
        }
        const run_step = b.step("run", "Run the MCP executable");
        run_step.dependOn(&run_mcp.step);
    }
}
