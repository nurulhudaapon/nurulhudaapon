# Server

The `Server` is the main component for exposing MCP capabilities to AI clients.

## Creating a Server

```zig
const mcp = @import("mcp");

var server = mcp.Server.init(.{
    .name = "my-server",
    .version = "1.0.0",
    .allocator = allocator,
});
defer server.deinit();
```

## Configuration

| Option        | Type          | Description               |
| ------------- | ------------- | ------------------------- |
| `name`        | `[]const u8`  | Server name (required)    |
| `version`     | `[]const u8`  | Server version (required) |
| `allocator`   | `Allocator`   | Memory allocator          |
| `title`       | `?[]const u8` | Human-readable title      |
| `description` | `?[]const u8` | Server description        |

## Capabilities

Enable server capabilities:

```zig
server.enableTools();
server.enableResources(true); // true = subscribe support
server.enablePrompts(true);   // true = listChanged support
server.enableLogging();
```

## Running the Server

### STDIO Transport

For command-line tools and local processes:

```zig
try server.run(.stdio);
```

### HTTP Transport

For remote access:

```zig
try server.run(.{ .http = .{ .host = "127.0.0.1", .port = 8080 } });
```

The server will log the listening address to stderr (e.g., `Server listening on http://127.0.0.1:8080`).

## Registering Components

### Tools

```zig
try server.addTool(.{
    .name = "calculate",
    .description = "Perform calculations",
    .handler = calcHandler,
    .input_schema = schema,
});
```

### Resources

```zig
try server.addResource(.{
    .uri = "file:///data.json",
    .name = "Data File",
    .mimeType = "application/json",
    .handler = dataHandler,
});
```

### Prompts

```zig
try server.addPrompt(.{
    .name = "summarize",
    .description = "Summarize text",
    .handler = summarizeHandler,
});
```

## Server Events

Handle server lifecycle events:

```zig
server.onInitialize = struct {
    fn callback(client_info: mcp.types.Implementation) void {
        std.debug.print("Client connected: {s}\n", .{client_info.name});
    }
}.callback;
```

## Error Handling

The server handles errors gracefully:

```zig
fn toolHandler(allocator: Allocator, args: ?json.Value) ToolError!ToolResult {
    // Return an error if something goes wrong
    if (invalid_input) {
        return error.InvalidArguments;
    }

    // Normal processing
    return .{ .content = &.{} };
}
```

## Complete Example

```zig
const std = @import("std");
const mcp = @import("mcp");

pub fn main() void {
    run() catch |err| {
        mcp.reportError(err);
    };
}

fn run() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var server = mcp.Server.init(.{
        .name = "demo-server",
        .version = "1.0.0",
        .description = "A demo MCP server",
        .allocator = allocator,
    });
    defer server.deinit();

    // Enable capabilities
    server.enableTools();
    server.enableResources(false);

    // Add tools
    try server.addTool(.{
        .name = "echo",
        .description = "Echo back the input",
        .handler = echoHandler,
    });

    // Run
    std.debug.print("Server starting...\n", .{});
    try server.run(.stdio);
}

fn echoHandler(
    allocator: std.mem.Allocator,
    args: ?std.json.Value,
) mcp.tools.ToolError!mcp.tools.ToolResult {
    const text = mcp.tools.getString(args, "text") orelse "No input";
    const result = try std.fmt.allocPrint(allocator, "Echo: {s}", .{text});

    return .{
        .content = &.{mcp.Content.createText(result)},
    };
}
```

## Next Steps

- [Tools Guide](/guide/tools) - Creating powerful tools
- [Resources Guide](/guide/resources) - Exposing data resources
- [Examples](/examples/simple-server) - Complete server examples
