# Types API

Core type definitions used throughout mcp.zig.

## Request ID

### `types.RequestId`

```zig
pub const RequestId = union(enum) {
    integer: i64,
    string: []const u8,
};
```

Request IDs can be either integers or strings.

**Example:**

```zig
const id1: mcp.types.RequestId = .{ .integer = 42 };
const id2: mcp.types.RequestId = .{ .string = "request-001" };
```

---

## Content

### `Content`

```zig
pub const Content = union(enum) {
    text: TextContent,
    image: ImageContent,
    resource: EmbeddedResource,
};
```

Content types for tool results and messages.

### `TextContent`

```zig
pub const TextContent = struct {
    text: []const u8,
};
```

### `ImageContent`

```zig
pub const ImageContent = struct {
    data: []const u8,
    mimeType: []const u8,
};
```

### Helper Functions

```zig
/// Create a text content item
pub fn createText(content: []const u8) Content

/// Create an image content item
pub fn createImage(data: []const u8, mimeType: []const u8) Content
```

**Example:**

```zig
const text = mcp.Content.createText("Hello, World!");
const image = mcp.Content.createImage(base64_data, "image/png");
```

---

## Tool Types

### `ToolResult`

```zig
pub const ToolResult = struct {
    content: []const ContentItem,
    isError: bool = false,
};
```

### `ToolError`

```zig
pub const ToolError = error{
    InvalidArguments,
    ExecutionFailed,
    OutOfMemory,
    Unknown,
};
```

---

## Resource Types

### `Resource`

```zig
pub const Resource = struct {
    uri: []const u8,
    name: []const u8,
    mimeType: ?[]const u8 = null,
    description: ?[]const u8 = null,
};
```

### `ResourceContent`

```zig
pub const ResourceContent = struct {
    uri: []const u8,
    mimeType: ?[]const u8 = null,
    text: ?[]const u8 = null,
    blob: ?[]const u8 = null,
};
```

### `ResourceError`

```zig
pub const ResourceError = error{
    NotFound,
    InvalidUri,
    AccessDenied,
    OutOfMemory,
};
```

---

## Root Types

### `Root`

```zig
pub const Root = struct {
    uri: []const u8,
    name: ?[]const u8 = null,
};
```

Represents a filesystem root.

---

## Implementation Info

### `Implementation`

```zig
pub const Implementation = struct {
    name: []const u8,
    version: []const u8,
    title: ?[]const u8 = null,
};
```

Used in initialize requests for server/client info.

---

## Capabilities

### `ServerCapabilities`

```zig
pub const ServerCapabilities = struct {
    tools: ?ToolsCapability = null,
    resources: ?ResourcesCapability = null,
    prompts: ?PromptsCapability = null,
    logging: ?LoggingCapability = null,
};
```

### `ClientCapabilities`

```zig
pub const ClientCapabilities = struct {
    roots: ?RootsCapability = null,
    sampling: ?SamplingCapability = null,
    elicitation: ?ElicitationCapability = null,
};
```

---

## Schema Types

### `Schema`

```zig
pub const Schema = struct {
    type: ?SchemaType = null,
    properties: ?std.json.ObjectMap = null,
    required: ?[]const []const u8 = null,
    items: ?*const Schema = null,
    description: ?[]const u8 = null,
    minimum: ?f64 = null,
    maximum: ?f64 = null,
    pattern: ?[]const u8 = null,
};
```

### `SchemaType`

```zig
pub const SchemaType = enum {
    object,
    array,
    string,
    number,
    integer,
    boolean,
    null_type,
};
```

---

## Log Levels

### `LogLevel`

```zig
pub const LogLevel = enum {
    debug,
    info,
    notice,
    warning,
    @"error",
    critical,
    alert,
    emergency,
};
```

---

## Complete Example

```zig
const std = @import("std");
const mcp = @import("mcp");

pub fn main() !void {
    // Create content items
    const text_content = mcp.Content.createText("Hello!");
    const image_content = mcp.Content.createImage("base64...", "image/png");

    // Create a root
    const root: mcp.types.Root = .{
        .uri = "file:///home/user/project",
        .name = "My Project",
    };

    // Create implementation info
    const impl: mcp.types.Implementation = .{
        .name = "my-app",
        .version = "1.0.0",
    };

    std.debug.print("Root: {s}\n", .{root.uri});
    std.debug.print("Implementation: {s} v{s}\n", .{ impl.name, impl.version });

    // Use content
    switch (text_content) {
        .text => |t| std.debug.print("Text: {s}\n", .{t.text}),
        .image => |i| std.debug.print("Image: {s}\n", .{i.mimeType}),
        else => {},
    }
}
```
