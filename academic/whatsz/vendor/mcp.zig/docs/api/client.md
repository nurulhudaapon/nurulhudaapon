# Client API

The `Client` struct is used to connect to MCP servers.

## Constructor

### `Client.init`

```zig
pub fn init(config: ClientConfig) Client
```

Create a new MCP client.

**Parameters:**

| Field       | Type         | Description               |
| ----------- | ------------ | ------------------------- |
| `name`      | `[]const u8` | Client name (required)    |
| `version`   | `[]const u8` | Client version (required) |
| `allocator` | `Allocator`  | Memory allocator          |

**Example:**

```zig
var client = mcp.Client.init(.{
    .name = "my-client",
    .version = "1.0.0",
    .allocator = allocator,
});
defer client.deinit();
```

---

## Lifecycle

### `Client.deinit`

```zig
pub fn deinit(self: *Client) void
```

Clean up client resources.

---

## Capabilities

### `Client.enableRoots`

```zig
pub fn enableRoots(self: *Client) void
```

Enable the roots capability. Allows the client to provide filesystem roots to the server.

### `Client.enableSampling`

```zig
pub fn enableSampling(self: *Client) void
```

Enable the sampling capability. Allows the server to request LLM completions.

---

## Roots Management

### `Client.addRoot`

```zig
pub fn addRoot(self: *Client, uri: []const u8, name: ?[]const u8) !void
```

Add a filesystem root.

**Parameters:**

- `uri` - URI of the root (e.g., `file:///home/user/project`)
- `name` - Human-readable name for the root

**Example:**

```zig
try client.addRoot("file:///home/user/documents", "Documents");
try client.addRoot("file:///home/user/projects", "Projects");
```

---

## Fields

### `client.config`

```zig
pub const config: ClientConfig
```

The client configuration.

### `client.allocator`

```zig
pub const allocator: Allocator
```

The memory allocator.

### `client.roots_list`

```zig
pub const roots_list: ArrayList(types.Root)
```

List of configured roots.

### `client.capabilities`

```zig
pub const capabilities: ClientCapabilities
```

Enabled capabilities.

---

## Complete Example

```zig
const std = @import("std");
const mcp = @import("mcp");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // Create client
    var client = mcp.Client.init(.{
        .name = "full-client",
        .version = "1.0.0",
        .allocator = allocator,
    });
    defer client.deinit();

    // Enable capabilities
    client.enableRoots();
    client.enableSampling();

    // Configure roots
    try client.addRoot("file:///home/user/docs", "Documentation");
    try client.addRoot("file:///home/user/code", "Source Code");

    // Print configuration
    std.debug.print("Client: {s} v{s}\n", .{
        client.config.name,
        client.config.version,
    });
    std.debug.print("Roots: {d}\n", .{client.roots_list.items.len});

    // In a full implementation, you would:
    // 1. Connect to a server via transport
    // 2. Send initialize request
    // 3. Interact with server capabilities
}
```

---

## Future API (Planned)

The following methods are planned for future releases:

### `Client.connect`

```zig
pub fn connect(self: *Client, options: ConnectOptions) !void
```

Connect to an MCP server.

### `Client.listTools`

```zig
pub fn listTools(self: *Client) ![]Tool
```

Get available tools from the server.

### `Client.callTool`

```zig
pub fn callTool(self: *Client, name: []const u8, args: ?json.Value) !ToolResult
```

Execute a tool on the server.

### `Client.listResources`

```zig
pub fn listResources(self: *Client) ![]Resource
```

Get available resources from the server.

### `Client.readResource`

```zig
pub fn readResource(self: *Client, uri: []const u8) ![]ResourceContent
```

Read a resource from the server.
