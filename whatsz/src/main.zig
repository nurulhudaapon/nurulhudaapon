const std = @import("std");
const mcp = @import("mcp");
const zqlite = @import("zqlite");

// WhatsApp SQLite database path
const DB_PATH = "/Users/nurulhudaapon/Library/Group Containers/group.net.whatsapp.WhatsApp.shared/ChatStorage.sqlite";

// Managed ArrayList for string building
const StringBuilder = std.array_list.AlignedManaged(u8, null);

pub fn main() !void {
    run() catch |err| {
        mcp.reportError(err);
    };
}

fn run() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var server = mcp.Server.init(.{
        .name = "whatsz-mcp",
        .version = "1.0.0",
        .allocator = allocator,
    });
    defer server.deinit();

    // Register WhatsApp tools
    try server.addTool(.{
        .name = "list_chats",
        .description =
        \\Retrieve a list of WhatsApp chats ordered by most recent activity.
        \\Each result includes chat name, chat JID, last message preview, unread message count,
        \\chat type (direct or group), archived status, and last message timestamp.
        \\Optional parameter: 'limit' (integer, default: 20) to control the number of chats returned.
        ,
        .handler = &listChatsHandler,
    });

    try server.addTool(.{
        .name = "get_chat_messages",
        .description =
        \\Fetch messages from a specific WhatsApp chat.
        \\You must provide either 'chat_name' (partial, case-insensitive match)
        \\or 'chat_jid' (exact match)
        \\Returns messages ordered from newest to oldest, including sender name,
        \\message text, message type (text/media), and timestamp.
        \\Optional parameters: 'limit' (integer, default: 50) and 'offset' (integer) for pagination.
        ,
        .handler = &getChatMessagesHandler,
    });

    try server.addTool(.{
        .name = "search_messages",
        .description =
        \\Search across all WhatsApp chats for messages containing a specific text string.
        \\Requires the 'query' parameter (string).
        \\Results include chat name, sender, message text, and timestamp,
        \\ordered by most recent message first.
        \\Optional parameter: 'limit' (integer, default: 50).
        ,
        .handler = &searchMessagesHandler,
    });

    try server.addTool(.{
        .name = "get_chat_stats",
        .description =
        \\Retrieve statistical insights for a specific WhatsApp chat.
        \\Requires either 'chat_name' (partial match) or 'chat_jid' (exact match).
        \\Returns total message count, messages sent vs received,
        \\first and last message timestamps, and media statistics
        \\(image, video, and audio message counts).
        ,
        .handler = &getChatStatsHandler,
    });

    try server.addTool(.{
        .name = "list_groups",
        .description =
        \\List all WhatsApp group chats ordered by recent activity.
        \\Each group includes group name, group JID, creation date, creator JID,
        \\and total member count.
        \\Optional parameter: 'limit' (integer, default: 20).
        ,
        .handler = &listGroupsHandler,
    });

    try server.addTool(.{
        .name = "get_group_members",
        .description =
        \\Retrieve the member list of a specific WhatsApp group.
        \\Requires either 'group_name' (partial match) or 'group_jid' (exact match).
        \\Returns each member's name, JID, admin status, and active/left status,
        \\with admins listed first.
        ,
        .handler = &getGroupMembersHandler,
    });

    // Run with STDIO transport
    try server.run(.stdio);
}

// Helper to open the WhatsApp database (read-only)
fn openDb() !zqlite.Conn {
    const flags = zqlite.OpenFlags.ReadOnly | zqlite.OpenFlags.EXResCode;
    return zqlite.open(DB_PATH, flags);
}

// Helper to convert Apple's Core Data timestamp to readable date
fn formatAppleTimestamp(allocator: std.mem.Allocator, timestamp: ?f64) ![]const u8 {
    if (timestamp) |ts| {
        // Apple Core Data uses seconds since 2001-01-01
        // Convert to Unix timestamp by adding seconds between 1970 and 2001
        const unix_ts: i64 = @intFromFloat(ts + 978307200);
        const epoch_seconds = std.time.epoch.EpochSeconds{ .secs = @intCast(unix_ts) };
        const day_seconds = epoch_seconds.getDaySeconds();
        const year_day = epoch_seconds.getEpochDay().calculateYearDay();
        const month_day = year_day.calculateMonthDay();

        return std.fmt.allocPrint(allocator, "{d:0>4}-{d:0>2}-{d:0>2} {d:0>2}:{d:0>2}:{d:0>2}", .{
            year_day.year,
            @intFromEnum(month_day.month),
            month_day.day_index + 1, // day_index is 0-based
            day_seconds.getHoursIntoDay(),
            day_seconds.getMinutesIntoHour(),
            day_seconds.getSecondsIntoMinute(),
        }) catch return "unknown";
    }
    return allocator.dupe(u8, "N/A") catch return "N/A";
}

fn listChatsHandler(allocator: std.mem.Allocator, args: ?std.json.Value) mcp.tools.ToolError!mcp.ToolResult {
    const limit = mcp.tools.getInteger(args, "limit") orelse 20;

    var conn = openDb() catch {
        return mcp.tools.errorResult(allocator, "Failed to open WhatsApp database. Make sure WhatsApp is installed and has chat history.") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer conn.close();

    var result = StringBuilder.init(allocator);
    var writer = result.writer();

    writer.writeAll("# WhatsApp Chats\n\n") catch return mcp.tools.ToolError.OutOfMemory;

    const query =
        \\SELECT 
        \\    cs.ZPARTNERNAME,
        \\    cs.ZCONTACTJID,
        \\    cs.ZLASTMESSAGETEXT,
        \\    cs.ZUNREADCOUNT,
        \\    cs.ZLASTMESSAGEDATE,
        \\    cs.ZARCHIVED,
        \\    cs.ZSESSIONTYPE
        \\FROM ZWACHATSESSION cs
        \\WHERE cs.ZHIDDEN = 0 OR cs.ZHIDDEN IS NULL
        \\ORDER BY cs.ZLASTMESSAGEDATE DESC
        \\LIMIT ?1
    ;

    var rows = conn.rows(query, .{limit}) catch {
        return mcp.tools.errorResult(allocator, "Failed to query chats") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer rows.deinit();

    var count: u32 = 0;
    while (rows.next()) |row| {
        count += 1;
        const name = row.nullableText(0) orelse "Unknown";
        const jid = row.text(1);
        const last_msg = row.text(2);
        const unread = row.nullableInt(3) orelse 0;
        const last_date = row.nullableFloat(4);
        const archived = row.nullableInt(5) orelse 0;
        const session_type = row.nullableInt(6) orelse 0;

        const date_str = formatAppleTimestamp(allocator, last_date) catch "unknown";
        const chat_type = if (session_type == 1) "Group" else "Direct";
        const archived_str = if (archived == 1) " [Archived]" else "";

        writer.print("## {d}. {s}{s}\n", .{ count, name, archived_str }) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Type:** {s}\n", .{chat_type}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **JID:** `{s}`\n", .{jid}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Last Message:** {s}\n", .{if (last_msg.len > 100) last_msg[0..100] else last_msg}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Unread:** {d}\n", .{unread}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Last Activity:** {s}\n\n", .{date_str}) catch return mcp.tools.ToolError.OutOfMemory;
    }
    if (rows.err) |_| return mcp.tools.ToolError.ExecutionFailed;

    if (count == 0) {
        writer.writeAll("No chats found.\n") catch return mcp.tools.ToolError.OutOfMemory;
    }

    return mcp.tools.textResult(allocator, result.items) catch return mcp.tools.ToolError.OutOfMemory;
}

fn getChatMessagesHandler(allocator: std.mem.Allocator, args: ?std.json.Value) mcp.tools.ToolError!mcp.ToolResult {
    const chat_name = mcp.tools.getString(args, "chat_name");
    const chat_jid = mcp.tools.getString(args, "chat_jid");
    const limit = mcp.tools.getInteger(args, "limit") orelse 50;
    const offset = mcp.tools.getInteger(args, "offset") orelse 0;

    if (chat_name == null and chat_jid == null) {
        return mcp.tools.errorResult(allocator, "Please provide either 'chat_name' or 'chat_jid' parameter.") catch return mcp.tools.ToolError.InvalidArguments;
    }

    var conn = openDb() catch {
        return mcp.tools.errorResult(allocator, "Failed to open WhatsApp database.") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer conn.close();

    // First find the chat session
    var session_pk: ?i64 = null;
    var partner_name: []const u8 = "Unknown";

    if (chat_jid) |jid| {
        const maybe_row = conn.row("SELECT Z_PK, ZPARTNERNAME FROM ZWACHATSESSION WHERE ZCONTACTJID = ?1", .{jid}) catch null;
        if (maybe_row) |row| {
            defer row.deinit();
            session_pk = row.int(0);
            const name_text = row.nullableText(1) orelse "Unknown";
            partner_name = allocator.dupe(u8, name_text) catch "Unknown";
        }
    } else if (chat_name) |name| {
        const search_pattern = std.fmt.allocPrint(allocator, "%{s}%", .{name}) catch return mcp.tools.ToolError.OutOfMemory;
        const maybe_row = conn.row("SELECT Z_PK, ZPARTNERNAME FROM ZWACHATSESSION WHERE ZPARTNERNAME LIKE ?1 LIMIT 1", .{search_pattern}) catch null;
        if (maybe_row) |row| {
            defer row.deinit();
            session_pk = row.int(0);
            const name_text = row.nullableText(1) orelse "Unknown";
            partner_name = allocator.dupe(u8, name_text) catch "Unknown";
        }
    }

    if (session_pk == null) {
        return mcp.tools.errorResult(allocator, "Chat not found. Try using list_chats to see available chats.") catch return mcp.tools.ToolError.ResourceNotFound;
    }

    var result = StringBuilder.init(allocator);
    var writer = result.writer();

    writer.print("# Messages from: {s}\n\n", .{partner_name}) catch return mcp.tools.ToolError.OutOfMemory;

    const query =
        \\SELECT 
        \\    m.ZTEXT,
        \\    m.ZMESSAGEDATE,
        \\    m.ZISFROMME,
        \\    m.ZPUSHNAME,
        \\    m.ZMESSAGETYPE,
        \\    m.ZFROMJID
        \\FROM ZWAMESSAGE m
        \\WHERE m.ZCHATSESSION = ?1
        \\ORDER BY m.ZMESSAGEDATE DESC
        \\LIMIT ?2 OFFSET ?3
    ;

    var rows = conn.rows(query, .{ session_pk.?, limit, offset }) catch {
        return mcp.tools.errorResult(allocator, "Failed to query messages") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer rows.deinit();

    var count: u32 = 0;
    while (rows.next()) |row| {
        count += 1;
        const text = row.nullableText(0) orelse "[Media/System Message]";
        const msg_date = row.nullableFloat(1);
        const is_from_me = row.nullableInt(2) orelse 0;
        const push_name = row.text(3);
        const msg_type = row.nullableInt(4) orelse 0;

        const date_str = formatAppleTimestamp(allocator, msg_date) catch "unknown";
        const sender = if (is_from_me == 1) "You" else if (push_name.len > 0) push_name else "Contact";

        const type_indicator = switch (msg_type) {
            0 => "",
            1 => " [Image]",
            2 => " [Video]",
            3 => " [Audio]",
            4 => " [Contact]",
            5 => " [Location]",
            else => " [Media]",
        };

        writer.print("**[{s}] {s}:**{s} {s}\n\n", .{ date_str, sender, type_indicator, text }) catch return mcp.tools.ToolError.OutOfMemory;
    }
    if (rows.err) |_| return mcp.tools.ToolError.ExecutionFailed;

    if (count == 0) {
        writer.writeAll("No messages found in this chat.\n") catch return mcp.tools.ToolError.OutOfMemory;
    } else {
        writer.print("\n---\n*Showing {d} messages (offset: {d})*\n", .{ count, offset }) catch return mcp.tools.ToolError.OutOfMemory;
    }

    return mcp.tools.textResult(allocator, result.items) catch return mcp.tools.ToolError.OutOfMemory;
}

fn searchMessagesHandler(allocator: std.mem.Allocator, args: ?std.json.Value) mcp.tools.ToolError!mcp.ToolResult {
    const query_text = mcp.tools.getString(args, "query") orelse {
        return mcp.tools.errorResult(allocator, "Please provide a 'query' parameter to search for.") catch return mcp.tools.ToolError.InvalidArguments;
    };
    const limit = mcp.tools.getInteger(args, "limit") orelse 50;

    var conn = openDb() catch {
        return mcp.tools.errorResult(allocator, "Failed to open WhatsApp database.") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer conn.close();

    var result = StringBuilder.init(allocator);
    var writer = result.writer();

    writer.print("# Search Results for: \"{s}\"\n\n", .{query_text}) catch return mcp.tools.ToolError.OutOfMemory;

    const search_pattern = std.fmt.allocPrint(allocator, "%{s}%", .{query_text}) catch return mcp.tools.ToolError.OutOfMemory;

    const query =
        \\SELECT 
        \\    m.ZTEXT,
        \\    m.ZMESSAGEDATE,
        \\    m.ZISFROMME,
        \\    m.ZPUSHNAME,
        \\    cs.ZPARTNERNAME
        \\FROM ZWAMESSAGE m
        \\JOIN ZWACHATSESSION cs ON m.ZCHATSESSION = cs.Z_PK
        \\WHERE m.ZTEXT LIKE ?1
        \\ORDER BY m.ZMESSAGEDATE DESC
        \\LIMIT ?2
    ;

    var rows = conn.rows(query, .{ search_pattern, limit }) catch {
        return mcp.tools.errorResult(allocator, "Failed to search messages") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer rows.deinit();

    var count: u32 = 0;
    while (rows.next()) |row| {
        count += 1;
        const text = row.text(0);
        const msg_date = row.nullableFloat(1);
        const is_from_me = row.nullableInt(2) orelse 0;
        const push_name = row.text(3);
        const chat_name = row.nullableText(4) orelse "Unknown";

        const date_str = formatAppleTimestamp(allocator, msg_date) catch "unknown";
        const sender = if (is_from_me == 1) "You" else if (push_name.len > 0) push_name else "Contact";

        writer.print("### {d}. In: {s}\n", .{ count, chat_name }) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("**[{s}] {s}:** {s}\n\n", .{ date_str, sender, text }) catch return mcp.tools.ToolError.OutOfMemory;
    }
    if (rows.err) |_| return mcp.tools.ToolError.ExecutionFailed;

    if (count == 0) {
        writer.writeAll("No messages found matching your search.\n") catch return mcp.tools.ToolError.OutOfMemory;
    }

    return mcp.tools.textResult(allocator, result.items) catch return mcp.tools.ToolError.OutOfMemory;
}

fn getChatStatsHandler(allocator: std.mem.Allocator, args: ?std.json.Value) mcp.tools.ToolError!mcp.ToolResult {
    const chat_name = mcp.tools.getString(args, "chat_name");
    const chat_jid = mcp.tools.getString(args, "chat_jid");

    if (chat_name == null and chat_jid == null) {
        return mcp.tools.errorResult(allocator, "Please provide either 'chat_name' or 'chat_jid' parameter.") catch return mcp.tools.ToolError.InvalidArguments;
    }

    var conn = openDb() catch {
        return mcp.tools.errorResult(allocator, "Failed to open WhatsApp database.") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer conn.close();

    // Find the chat session
    var session_pk: ?i64 = null;
    var partner_name: []const u8 = "Unknown";
    var contact_jid: []const u8 = "";

    if (chat_jid) |jid| {
        const maybe_row = conn.row("SELECT Z_PK, ZPARTNERNAME, ZCONTACTJID FROM ZWACHATSESSION WHERE ZCONTACTJID = ?1", .{jid}) catch null;
        if (maybe_row) |row| {
            defer row.deinit();
            session_pk = row.int(0);
            const name_text = row.nullableText(1) orelse "Unknown";
            partner_name = allocator.dupe(u8, name_text) catch "Unknown";
            const jid_text = row.text(2);
            contact_jid = allocator.dupe(u8, jid_text) catch "";
        }
    } else if (chat_name) |name| {
        const search_pattern = std.fmt.allocPrint(allocator, "%{s}%", .{name}) catch return mcp.tools.ToolError.OutOfMemory;
        const maybe_row = conn.row("SELECT Z_PK, ZPARTNERNAME, ZCONTACTJID FROM ZWACHATSESSION WHERE ZPARTNERNAME LIKE ?1 LIMIT 1", .{search_pattern}) catch null;
        if (maybe_row) |row| {
            defer row.deinit();
            session_pk = row.int(0);
            const name_text = row.nullableText(1) orelse "Unknown";
            partner_name = allocator.dupe(u8, name_text) catch "Unknown";
            const jid_text = row.text(2);
            contact_jid = allocator.dupe(u8, jid_text) catch "";
        }
    }

    if (session_pk == null) {
        return mcp.tools.errorResult(allocator, "Chat not found.") catch return mcp.tools.ToolError.ResourceNotFound;
    }

    var result = StringBuilder.init(allocator);
    var writer = result.writer();

    writer.print("# Chat Statistics: {s}\n\n", .{partner_name}) catch return mcp.tools.ToolError.OutOfMemory;
    writer.print("**JID:** `{s}`\n\n", .{contact_jid}) catch return mcp.tools.ToolError.OutOfMemory;

    // Get message counts
    const stats_query =
        \\SELECT 
        \\    COUNT(*) as total,
        \\    SUM(CASE WHEN ZISFROMME = 1 THEN 1 ELSE 0 END) as from_me,
        \\    SUM(CASE WHEN ZISFROMME = 0 THEN 1 ELSE 0 END) as from_them,
        \\    MIN(ZMESSAGEDATE) as first_msg,
        \\    MAX(ZMESSAGEDATE) as last_msg
        \\FROM ZWAMESSAGE WHERE ZCHATSESSION = ?1
    ;
    const maybe_stats_row = conn.row(stats_query, .{session_pk.?}) catch null;
    if (maybe_stats_row) |row| {
        defer row.deinit();
        const total = row.int(0);
        const from_me = row.nullableInt(1) orelse 0;
        const from_them = row.nullableInt(2) orelse 0;
        const first_msg = row.nullableFloat(3);
        const last_msg = row.nullableFloat(4);

        const first_date = formatAppleTimestamp(allocator, first_msg) catch "unknown";
        const last_date = formatAppleTimestamp(allocator, last_msg) catch "unknown";

        writer.print("## Message Statistics\n", .{}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Total Messages:** {d}\n", .{total}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Messages from You:** {d}\n", .{from_me}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Messages from Contact:** {d}\n", .{from_them}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **First Message:** {s}\n", .{first_date}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Last Message:** {s}\n\n", .{last_date}) catch return mcp.tools.ToolError.OutOfMemory;
    }

    // Get media counts
    const media_query =
        \\SELECT 
        \\    SUM(CASE WHEN m.ZMESSAGETYPE = 1 THEN 1 ELSE 0 END) as images,
        \\    SUM(CASE WHEN m.ZMESSAGETYPE = 2 THEN 1 ELSE 0 END) as videos,
        \\    SUM(CASE WHEN m.ZMESSAGETYPE = 3 THEN 1 ELSE 0 END) as audio
        \\FROM ZWAMESSAGE m WHERE m.ZCHATSESSION = ?1
    ;
    const maybe_media_row = conn.row(media_query, .{session_pk.?}) catch null;
    if (maybe_media_row) |row| {
        defer row.deinit();
        const images = row.nullableInt(0) orelse 0;
        const videos = row.nullableInt(1) orelse 0;
        const audio = row.nullableInt(2) orelse 0;

        writer.print("## Media Statistics\n", .{}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Images:** {d}\n", .{images}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Videos:** {d}\n", .{videos}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Audio Messages:** {d}\n", .{audio}) catch return mcp.tools.ToolError.OutOfMemory;
    }

    return mcp.tools.textResult(allocator, result.items) catch return mcp.tools.ToolError.OutOfMemory;
}

fn listGroupsHandler(allocator: std.mem.Allocator, args: ?std.json.Value) mcp.tools.ToolError!mcp.ToolResult {
    const limit = mcp.tools.getInteger(args, "limit") orelse 20;

    var conn = openDb() catch {
        return mcp.tools.errorResult(allocator, "Failed to open WhatsApp database.") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer conn.close();

    var result = StringBuilder.init(allocator);
    var writer = result.writer();

    writer.writeAll("# WhatsApp Groups\n\n") catch return mcp.tools.ToolError.OutOfMemory;

    const query =
        \\SELECT 
        \\    cs.ZPARTNERNAME,
        \\    cs.ZCONTACTJID,
        \\    gi.ZCREATIONDATE,
        \\    gi.ZCREATORJID,
        \\    (SELECT COUNT(*) FROM ZWAGROUPMEMBER gm WHERE gm.ZCHATSESSION = cs.Z_PK) as member_count
        \\FROM ZWACHATSESSION cs
        \\LEFT JOIN ZWAGROUPINFO gi ON cs.ZGROUPINFO = gi.Z_PK
        \\WHERE cs.ZSESSIONTYPE = 1
        \\ORDER BY cs.ZLASTMESSAGEDATE DESC
        \\LIMIT ?1
    ;

    var rows = conn.rows(query, .{limit}) catch {
        return mcp.tools.errorResult(allocator, "Failed to query groups") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer rows.deinit();

    var count: u32 = 0;
    while (rows.next()) |row| {
        count += 1;
        const name = row.nullableText(0) orelse "Unknown Group";
        const jid = row.text(1);
        const creation_date = row.nullableFloat(2);
        const creator = row.nullableText(3) orelse "Unknown";
        const member_count = row.int(4);

        const date_str = formatAppleTimestamp(allocator, creation_date) catch "unknown";

        writer.print("## {d}. {s}\n", .{ count, name }) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **JID:** `{s}`\n", .{jid}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Members:** {d}\n", .{member_count}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Created:** {s}\n", .{date_str}) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("- **Creator:** {s}\n\n", .{creator}) catch return mcp.tools.ToolError.OutOfMemory;
    }
    if (rows.err) |_| return mcp.tools.ToolError.ExecutionFailed;

    if (count == 0) {
        writer.writeAll("No groups found.\n") catch return mcp.tools.ToolError.OutOfMemory;
    }

    return mcp.tools.textResult(allocator, result.items) catch return mcp.tools.ToolError.OutOfMemory;
}

fn getGroupMembersHandler(allocator: std.mem.Allocator, args: ?std.json.Value) mcp.tools.ToolError!mcp.ToolResult {
    const group_name = mcp.tools.getString(args, "group_name");
    const group_jid = mcp.tools.getString(args, "group_jid");

    if (group_name == null and group_jid == null) {
        return mcp.tools.errorResult(allocator, "Please provide either 'group_name' or 'group_jid' parameter.") catch return mcp.tools.ToolError.InvalidArguments;
    }

    var conn = openDb() catch {
        return mcp.tools.errorResult(allocator, "Failed to open WhatsApp database.") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer conn.close();

    // Find the group session
    var session_pk: ?i64 = null;
    var partner_name: []const u8 = "Unknown";

    if (group_jid) |jid| {
        const maybe_row = conn.row("SELECT Z_PK, ZPARTNERNAME FROM ZWACHATSESSION WHERE ZCONTACTJID = ?1 AND ZSESSIONTYPE = 1", .{jid}) catch null;
        if (maybe_row) |row| {
            defer row.deinit();
            session_pk = row.int(0);
            const name_text = row.nullableText(1) orelse "Unknown";
            partner_name = allocator.dupe(u8, name_text) catch "Unknown";
        }
    } else if (group_name) |name| {
        const search_pattern = std.fmt.allocPrint(allocator, "%{s}%", .{name}) catch return mcp.tools.ToolError.OutOfMemory;
        const maybe_row = conn.row("SELECT Z_PK, ZPARTNERNAME FROM ZWACHATSESSION WHERE ZPARTNERNAME LIKE ?1 AND ZSESSIONTYPE = 1 LIMIT 1", .{search_pattern}) catch null;
        if (maybe_row) |row| {
            defer row.deinit();
            session_pk = row.int(0);
            const name_text = row.nullableText(1) orelse "Unknown";
            partner_name = allocator.dupe(u8, name_text) catch "Unknown";
        }
    }

    if (session_pk == null) {
        return mcp.tools.errorResult(allocator, "Group not found. Try using list_groups to see available groups.") catch return mcp.tools.ToolError.ResourceNotFound;
    }

    var result = StringBuilder.init(allocator);
    var writer = result.writer();

    writer.print("# Members of: {s}\n\n", .{partner_name}) catch return mcp.tools.ToolError.OutOfMemory;

    const query =
        \\SELECT 
        \\    ZCONTACTNAME,
        \\    ZMEMBERJID,
        \\    ZISADMIN,
        \\    ZISACTIVE
        \\FROM ZWAGROUPMEMBER
        \\WHERE ZCHATSESSION = ?1
        \\ORDER BY ZISADMIN DESC, ZCONTACTNAME
    ;

    var rows = conn.rows(query, .{session_pk.?}) catch {
        return mcp.tools.errorResult(allocator, "Failed to query group members") catch return mcp.tools.ToolError.ExecutionFailed;
    };
    defer rows.deinit();

    var count: u32 = 0;
    while (rows.next()) |row| {
        count += 1;
        const name = row.nullableText(0) orelse "Unknown";
        const jid = row.text(1);
        const is_admin = row.nullableInt(2) orelse 0;
        const is_active = row.nullableInt(3) orelse 1;

        const admin_badge = if (is_admin == 1) " 👑 Admin" else "";
        const active_status = if (is_active == 0) " (Left)" else "";

        writer.print("{d}. **{s}**{s}{s}\n", .{ count, name, admin_badge, active_status }) catch return mcp.tools.ToolError.OutOfMemory;
        writer.print("   - JID: `{s}`\n\n", .{jid}) catch return mcp.tools.ToolError.OutOfMemory;
    }
    if (rows.err) |_| return mcp.tools.ToolError.ExecutionFailed;

    if (count == 0) {
        writer.writeAll("No members found for this group.\n") catch return mcp.tools.ToolError.OutOfMemory;
    } else {
        writer.print("\n**Total Members:** {d}\n", .{count}) catch return mcp.tools.ToolError.OutOfMemory;
    }

    return mcp.tools.textResult(allocator, result.items) catch return mcp.tools.ToolError.OutOfMemory;
}
