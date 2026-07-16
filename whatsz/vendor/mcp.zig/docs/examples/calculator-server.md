# Calculator Server Example

An MCP server demonstrating mathematical operations with input validation.

## Overview

This example shows how to:

- Validate input arguments
- Handle multiple operations
- Return formatted results
- Provide helpful error messages

## Features

- **calculate**: Perform basic arithmetic operations
- Support for: add, subtract, multiply, divide
- Input validation and error handling

## Source Code

```zig
//! Calculator Server Example
//!
//! Demonstrates input validation and mathematical operations.

const std = @import("std");
const mcp = @import("mcp");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var server = mcp.Server.init(.{
        .name = "calculator-server",
        .version = "1.0.0",
        .description = "A simple calculator MCP server",
        .allocator = allocator,
    });
    defer server.deinit();

    server.enableTools();

    try server.addTool(.{
        .name = "calculate",
        .description = "Perform a mathematical operation",
        .handler = calculateHandler,
    });

    try server.addTool(.{
        .name = "sqrt",
        .description = "Calculate square root",
        .handler = sqrtHandler,
    });

    try server.addTool(.{
        .name = "power",
        .description = "Calculate power (base^exponent)",
        .handler = powerHandler,
    });

    std.debug.print("Calculator server starting...\n", .{});
    try server.run(.stdio);
}

fn calculateHandler(
    allocator: std.mem.Allocator,
    args: ?std.json.Value,
) mcp.tools.ToolError!mcp.tools.ToolResult {
    // Get and validate operation
    const operation = mcp.tools.getStringArg(args, "operation") orelse {
        return errorResult(allocator, "Missing 'operation' argument. Use: add, subtract, multiply, divide");
    };

    // Get and validate operands
    const a = mcp.tools.getNumberArg(args, "a") orelse {
        return errorResult(allocator, "Missing 'a' argument (first number)");
    };

    const b = mcp.tools.getNumberArg(args, "b") orelse {
        return errorResult(allocator, "Missing 'b' argument (second number)");
    };

    // Perform operation
    const result: f64 = if (std.mem.eql(u8, operation, "add"))
        a + b
    else if (std.mem.eql(u8, operation, "subtract"))
        a - b
    else if (std.mem.eql(u8, operation, "multiply"))
        a * b
    else if (std.mem.eql(u8, operation, "divide")) blk: {
        if (b == 0) {
            return errorResult(allocator, "Cannot divide by zero");
        }
        break :blk a / b;
    } else {
        return errorResult(allocator, "Unknown operation. Use: add, subtract, multiply, divide");
    };

    // Format result
    const message = try std.fmt.allocPrint(
        allocator,
        "{d} {s} {d} = {d}",
        .{ a, operation, b, result },
    );

    return .{ .content = &.{mcp.Content.createText(message)} };
}

fn sqrtHandler(
    allocator: std.mem.Allocator,
    args: ?std.json.Value,
) mcp.tools.ToolError!mcp.tools.ToolResult {
    const n = mcp.tools.getNumberArg(args, "n") orelse {
        return errorResult(allocator, "Missing 'n' argument");
    };

    if (n < 0) {
        return errorResult(allocator, "Cannot calculate square root of negative number");
    }

    const result = @sqrt(n);

    const message = try std.fmt.allocPrint(
        allocator,
        "√{d} = {d}",
        .{ n, result },
    );

    return .{ .content = &.{mcp.Content.createText(message)} };
}

fn powerHandler(
    allocator: std.mem.Allocator,
    args: ?std.json.Value,
) mcp.tools.ToolError!mcp.tools.ToolResult {
    const base = mcp.tools.getNumberArg(args, "base") orelse {
        return errorResult(allocator, "Missing 'base' argument");
    };

    const exponent = mcp.tools.getNumberArg(args, "exponent") orelse {
        return errorResult(allocator, "Missing 'exponent' argument");
    };

    const result = std.math.pow(f64, base, exponent);

    const message = try std.fmt.allocPrint(
        allocator,
        "{d}^{d} = {d}",
        .{ base, exponent, result },
    );

    return .{ .content = &.{mcp.Content.createText(message)} };
}

fn errorResult(allocator: std.mem.Allocator, message: []const u8) mcp.tools.ToolResult {
    _ = allocator;
    return .{
        .content = &.{mcp.Content.createText(message)},
        .isError = true,
    };
}
```

## Tool Specifications

### calculate

| Argument    | Type   | Required | Description                     |
| ----------- | ------ | -------- | ------------------------------- |
| `operation` | string | Yes      | add, subtract, multiply, divide |
| `a`         | number | Yes      | First operand                   |
| `b`         | number | Yes      | Second operand                  |

### sqrt

| Argument | Type   | Required | Description                   |
| -------- | ------ | -------- | ----------------------------- |
| `n`      | number | Yes      | Number to find square root of |

### power

| Argument   | Type   | Required | Description |
| ---------- | ------ | -------- | ----------- |
| `base`     | number | Yes      | Base number |
| `exponent` | number | Yes      | Exponent    |

## Usage Examples

### Basic Calculation

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "calculate",
    "arguments": {
      "operation": "multiply",
      "a": 7,
      "b": 8
    }
  }
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{ "type": "text", "text": "7 multiply 8 = 56" }]
  }
}
```

### Square Root

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "sqrt",
    "arguments": { "n": 144 }
  }
}
```

### Error Handling

Division by zero:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "calculate",
    "arguments": {
      "operation": "divide",
      "a": 10,
      "b": 0
    }
  }
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [{ "type": "text", "text": "Cannot divide by zero" }],
    "isError": true
  }
}
```

## Key Patterns

### Input Validation

Always validate arguments before processing:

```zig
const value = mcp.tools.getNumberArg(args, "key") orelse {
    return errorResult(allocator, "Missing required argument");
};
```

### Error Results

Return errors with `isError: true`:

```zig
return .{
    .content = &.{mcp.Content.createText("Error message")},
    .isError = true,
};
```

### Graceful Degradation

Provide helpful messages for unknown operations:

```zig
} else {
    return errorResult(allocator, "Unknown operation. Use: add, subtract, multiply, divide");
};
```

## Next Steps

- [Error Handling Guide](/guide/error-handling) - Best practices
- [Schema Validation](/guide/schema) - Define input schemas
- [Tools Guide](/guide/tools) - Advanced tool patterns
