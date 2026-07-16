# Contributing

Thank you for your interest in contributing to mcp.zig! We welcome contributions from the community.

## Ways to Contribute

- 🐛 **Report Bugs** - Found a bug? Open an issue!
- 💡 **Suggest Features** - Have an idea? Let us know!
- 📝 **Improve Documentation** - Help make docs better
- 🔧 **Submit Pull Requests** - Fix bugs or add features

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/mcp.zig.git
cd mcp.zig
```

### 2. Build the Project

```bash
zig build
```

### 3. Run Tests

```bash
zig build test
```

### 4. Make Your Changes

Create a new branch for your changes:

```bash
git checkout -b feature/my-new-feature
```

## Code Guidelines

### Style

- Follow Zig's official style guide
- Use meaningful variable and function names
- Add documentation comments for public APIs
- Keep functions focused and small

### Documentation

```zig
/// Brief description of the function.
///
/// More detailed description if needed.
///
/// ## Parameters
/// - `param1`: Description of param1
/// - `param2`: Description of param2
///
/// ## Returns
/// Description of the return value.
///
/// ## Errors
/// - `error.SomeError`: When this error occurs
pub fn myFunction(param1: Type1, param2: Type2) !ReturnType {
    // ...
}
```

### Testing

- Add tests for new functionality
- Ensure all existing tests pass
- Use `std.testing.allocator` in tests

```zig
test "my feature works" {
    const allocator = std.testing.allocator;

    // Test implementation
    try std.testing.expect(result == expected);
}
```

## Pull Request Process

1. **Update Documentation** - Update docs if needed
2. **Add Tests** - Add tests for new features
3. **Run Tests** - Ensure all tests pass
4. **Create PR** - Submit your pull request
5. **Describe Changes** - Clearly describe what you changed

### PR Title Format

```
type(scope): description

Examples:
feat(server): add resource templates support
fix(jsonrpc): handle null request IDs
docs(guide): add advanced usage section
test(client): add connection tests
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `chore` - Maintenance

## Development Setup

### Prerequisites

- Zig 0.15.0+
- Git
- (Optional) Node.js 20+ for docs

### Building Documentation

```bash
cd docs
npm install
npm run docs:dev
```

### Project Structure

```
mcp.zig/
├── src/
│   ├── mcp.zig          # Main entry point
│   ├── protocol/        # Protocol implementation
│   ├── server/          # Server implementation
│   ├── client/          # Client implementation
│   └── transport/       # Transport implementations
├── examples/            # Example code
├── docs/                # VitePress documentation
└── build.zig            # Build configuration
```

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

## Questions?

- Open a [Discussion](https://github.com/muhammad-fiaz/mcp.zig/discussions)
- Check existing [Issues](https://github.com/muhammad-fiaz/mcp.zig/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
