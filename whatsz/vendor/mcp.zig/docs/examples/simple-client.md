# Simple Client Example

A minimal MCP client that connects to servers.

## Overview

This example demonstrates how to:

- Create an MCP client
- Configure capabilities
- Connect to a server (conceptually)

## Source Code

```zig
//! Simple MCP Client Example
//!
//! Demonstrates basic client setup and configuration.

const std = @import("std");
const mcp = @import("mcp");

pub fn main() !void {
    // Get command line args
    const args = std.process.args();
    _ = args.skip(); // Skip program name

    const server_command = args.next() orelse {
        std.debug.print("Usage: example-client <server-command>\n", .{});
        std.debug.print("Example: example-client zig-out/bin/example-server\n", .{});
        return;
    };

    std.debug.print("Would connect to server: {s}\n", .{server_command});

    // Initialize allocator
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Create the client
    var client = mcp.Client.init(.{
        .name = "simple-client",
        .version = "1.0.0",
        .allocator = allocator,
    });
    defer client.deinit();

    // Enable capabilities
    client.enableRoots();
    client.enableSampling();

    // Add some roots
    try client.addRoot("file:///home/user/documents", "Documents");
    try client.addRoot("file:///home/user/projects", "Projects");

    // Print configuration
    std.debug.print("\nClient Configuration:\n", .{});
    std.debug.print("  Name: {s}\n", .{client.config.name});
    std.debug.print("  Version: {s}\n", .{client.config.version});
    std.debug.print("  Roots configured: {d}\n", .{client.roots_list.items.len});

    // In a real implementation, you would:
    // 1. Spawn the server process
    // 2. Connect via transport
    // 3. Send initialize request
    // 4. Call tools, read resources, etc.

    std.debug.print("\nClient initialized successfully!\n", .{});
}
```

## How Clients Work

### 1. Initialization

```zig
var client = mcp.Client.init(.{
    .name = "my-client",
    .version = "1.0.0",
    .allocator = allocator,
});
```

### 2. Enable Capabilities

```zig
client.enableRoots();     // File system roots
client.enableSampling();  // Sampling requests
```

### 3. Configure Roots

```zig
try client.addRoot("file:///path", "Name");
```

### 4. Connect (Full Implementation)

```zig
// Would spawn server and initialize connection
try client.connect(.{
    .transport = .stdio,
    .command = "./server",
});

// Initialize handshake
const server_info = try client.initialize();
std.debug.print("Connected to: {s}\n", .{server_info.name});
```

### 5. Use Server Capabilities

```zig
// List available tools
const tools = try client.listTools();

// Call a tool
const result = try client.callTool("greet", .{
    .object = args,
});

// Read a resource
const content = try client.readResource("file:///data.txt");
```

## Running the Example

### Build

```bash
zig build
```

### Run

```bash
./zig-out/bin/example-client ./zig-out/bin/example-server
```

## Protocol Flow

```
Client                              Server
  |                                    |
  |--- initialize ------------------->|
  |<-- initialize response -----------|
  |                                    |
  |--- initialized ------------------>|
  |                                    |
  |--- tools/list ------------------->|
  |<-- tools list --------------------|
  |                                    |
  |--- tools/call ------------------->|
  |<-- tool result -------------------|
  |                                    |
```

## Next Steps

- [Server Guide](/guide/server) - Learn about servers
- [Client Guide](/guide/client) - Full client documentation
- [Tools Guide](/guide/tools) - Understanding tools
