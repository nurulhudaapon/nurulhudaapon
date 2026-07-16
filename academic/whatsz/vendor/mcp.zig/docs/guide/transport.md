# Transport

Transports handle the communication layer between MCP clients and servers.

## Available Transports

| Transport | Use Case        | Protocol     |
| --------- | --------------- | ------------ |
| **STDIO** | Local processes | stdin/stdout |
| **HTTP**  | Remote servers  | HTTP/HTTPS   |

## STDIO Transport

The most common transport for local MCP servers.

### Server Side

```zig
try server.run(.stdio);
```

### Client Side

```zig
try client.connect(.{
    .transport = .stdio,
    .command = "./my-server",
});
```

### How It Works

1. Client spawns the server as a child process
2. Communication happens via stdin/stdout
3. JSON-RPC messages are exchanged line by line

### Message Format

Each message is a single line of JSON followed by a newline:

```
{"jsonrpc":"2.0","method":"initialize","id":1,"params":{...}}\n
```

## HTTP Transport

For remote MCP servers or web-based integration.

### Server Side

```zig
try server.run(.{ .http = .{ .port = 8080 } });
```

### Client Side

```zig
try client.connect(.{
    .transport = .http,
    .url = "http://localhost:8080",
});
```

### Endpoints

| Endpoint | Method | Description                 |
| -------- | ------ | --------------------------- |
| `/`      | POST   | JSON-RPC endpoint           |
| `/sse`   | GET    | Server-Sent Events (future) |

## Custom Transports

Implement the `Transport` interface for custom transports:

```zig
const MyTransport = struct {
    allocator: std.mem.Allocator,

    pub fn init(allocator: std.mem.Allocator) MyTransport {
        return .{ .allocator = allocator };
    }

    pub fn send(self: *MyTransport, message: []const u8) !void {
        // Send the message
    }

    pub fn receive(self: *MyTransport) !?[]const u8 {
        // Receive a message
    }

    pub fn close(self: *MyTransport) void {
        // Close the transport
    }

    pub fn transport(self: *MyTransport) mcp.transport.Transport {
        return .{
            .ptr = self,
            .vtable = &.{
                .send = send_wrapper,
                .receive = receive_wrapper,
                .close = close_wrapper,
            },
        };
    }
};
```

## Transport Options

### STDIO Options

```zig
const stdio_transport = mcp.transport.StdioTransport.init(allocator);
```

### HTTP Options

```zig
const http_transport = mcp.transport.HttpTransport.init(
    allocator,
    "http://localhost:8080",
);
```

## Best Practices

### STDIO

::: tip Recommended for

- Command-line tools
- Local development
- IDE integrations
- Desktop applications
  :::

### HTTP

::: tip Recommended for

- Remote servers
- Microservices
- Cloud deployments
- Multi-client scenarios
  :::

## Error Handling

```zig
const message = transport.receive() catch |err| {
    switch (err) {
        error.Timeout => {
            // Handle timeout
        },
        error.ConnectionClosed => {
            // Handle disconnect
        },
        else => return err,
    }
};
```

## Complete Example

```zig
const std = @import("std");
const mcp = @import("mcp");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Create server
    var server = mcp.Server.init(.{
        .name = "multi-transport-server",
        .version = "1.0.0",
        .allocator = allocator,
    });
    defer server.deinit();

    // Get transport mode from args
    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);

    const mode = if (args.len > 1) args[1] else "stdio";

    if (std.mem.eql(u8, mode, "http")) {
        std.debug.print("Starting HTTP server on port 8080...\n", .{});
        try server.run(.{ .http = .{ .port = 8080 } });
    } else {
        std.debug.print("Starting STDIO server...\n", .{});
        try server.run(.stdio);
    }
}
```

## Next Steps

- [JSON-RPC Protocol](/guide/jsonrpc) - Understand the protocol
- [Error Handling](/guide/error-handling) - Handle transport errors
- [API Reference](/api/protocol#transport) - Transport API details
