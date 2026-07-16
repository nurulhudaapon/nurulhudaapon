# Weather Server Example

A more advanced MCP server that demonstrates multiple tools with external data simulation.

## Overview

This example shows how to:

- Create multiple related tools
- Simulate external API calls
- Handle complex arguments
- Return structured data

## Features

- **get_weather**: Get current weather for a location
- **get_forecast**: Get weather forecast
- **weather_alerts**: Check for weather alerts

## Source Code

```zig
//! Weather Server Example
//!
//! Demonstrates a more complex MCP server with multiple tools.

const std = @import("std");
const mcp = @import("mcp");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var server = mcp.Server.init(.{
        .name = "weather-server",
        .version = "1.0.0",
        .description = "Provides weather information",
        .allocator = allocator,
    });
    defer server.deinit();

    server.enableTools();

    // Current weather
    try server.addTool(.{
        .name = "get_weather",
        .description = "Get current weather for a location",
        .handler = getCurrentWeather,
    });

    // Forecast
    try server.addTool(.{
        .name = "get_forecast",
        .description = "Get weather forecast for upcoming days",
        .handler = getForecast,
    });

    // Alerts
    try server.addTool(.{
        .name = "weather_alerts",
        .description = "Check for active weather alerts",
        .handler = getAlerts,
    });

    std.debug.print("Weather server starting...\n", .{});
    try server.run(.stdio);
}

fn getCurrentWeather(
    allocator: std.mem.Allocator,
    args: ?std.json.Value,
) mcp.tools.ToolError!mcp.tools.ToolResult {
    const location = mcp.tools.getStringArg(args, "location") orelse {
        return error.InvalidArguments;
    };

    // Simulate weather data
    const weather = try std.fmt.allocPrint(
        allocator,
        \\Weather for {s}:
        \\  Temperature: 72°F (22°C)
        \\  Conditions: Partly Cloudy
        \\  Humidity: 45%
        \\  Wind: 8 mph NW
        \\  UV Index: 6 (High)
    ,
        .{location},
    );

    return .{ .content = &.{mcp.Content.createText(weather)} };
}

fn getForecast(
    allocator: std.mem.Allocator,
    args: ?std.json.Value,
) mcp.tools.ToolError!mcp.tools.ToolResult {
    const location = mcp.tools.getStringArg(args, "location") orelse {
        return error.InvalidArguments;
    };

    const days = mcp.tools.getNumberArg(args, "days") orelse 3;
    const days_int: u32 = @intFromFloat(days);

    var forecast = std.ArrayList(u8).init(allocator);
    const writer = forecast.writer();

    try writer.print("5-Day Forecast for {s}:\n\n", .{location});

    const conditions = [_][]const u8{ "Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear" };
    const temps = [_]u8{ 75, 72, 68, 65, 70 };

    var i: u32 = 0;
    while (i < @min(days_int, 5)) : (i += 1) {
        try writer.print("Day {d}: {s}, High: {d}°F\n", .{
            i + 1,
            conditions[i],
            temps[i],
        });
    }

    return .{ .content = &.{mcp.Content.createText(forecast.items)} };
}

fn getAlerts(
    allocator: std.mem.Allocator,
    args: ?std.json.Value,
) mcp.tools.ToolError!mcp.tools.ToolResult {
    const location = mcp.tools.getStringArg(args, "location") orelse {
        return error.InvalidArguments;
    };

    // Simulate checking for alerts
    const alert_check = try std.fmt.allocPrint(
        allocator,
        \\Weather Alerts for {s}:
        \\
        \\✓ No active weather alerts at this time.
        \\
        \\Conditions are normal. Enjoy the weather!
    ,
        .{location},
    );

    return .{ .content = &.{mcp.Content.createText(alert_check)} };
}
```

## Tool Specifications

### get_weather

| Argument   | Type   | Required | Description           |
| ---------- | ------ | -------- | --------------------- |
| `location` | string | Yes      | City or location name |

### get_forecast

| Argument   | Type   | Required | Description           |
| ---------- | ------ | -------- | --------------------- |
| `location` | string | Yes      | City or location name |
| `days`     | number | No       | Number of days (1-5)  |

### weather_alerts

| Argument   | Type   | Required | Description           |
| ---------- | ------ | -------- | --------------------- |
| `location` | string | Yes      | City or location name |

## Usage

### Build and Run

```bash
zig build
./zig-out/bin/weather-server
```

### Example Requests

Get current weather:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "San Francisco"
    }
  }
}
```

Get forecast:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_forecast",
    "arguments": {
      "location": "New York",
      "days": 5
    }
  }
}
```

## Extending the Example

### Add Real Weather API

```zig
fn fetchRealWeather(allocator: Allocator, location: []const u8) !WeatherData {
    // Use std.http.Client to fetch from a real API
    var client = std.http.Client{ .allocator = allocator };
    defer client.deinit();

    // Make API request...
}
```

### Add More Tools

- `get_hourly_forecast` - Hour by hour forecast
- `get_historical` - Historical weather data
- `compare_cities` - Compare weather between cities

## Next Steps

- [Calculator Server](/examples/calculator-server) - Input validation
- [Tools Guide](/guide/tools) - Advanced tool patterns
- [Error Handling](/guide/error-handling) - Handle errors gracefully
