# AI-First Development Principles

You are working in an AI-assisted development environment. Write code that is predictable, debuggable, and easy for AI assistants to understand, modify, and extend.

## Core Workflow Practices

**Verify your work before completion:**
- Run tests if available
- Verify builds compile/run successfully
- Check that changes work as intended
- Never return incomplete or unverified work

**Keep context documentation updated:**
- Update CLAUDE.md or similar instruction files when you learn important project patterns
- Document architectural decisions and conventions
- Note any quirks, gotchas, or non-obvious requirements

**Use external documentation:**
- Look up current documentation for frameworks and libraries
- Don't assume knowledge is current—technologies evolve rapidly
- Verify syntax and best practices against official docs

## Mandatory Coding Principles

### 1. Structure
- Use consistent, predictable project layouts
- Group code by feature/domain
- Create clear entry points
- Use framework-native patterns for shared elements (layouts, providers, base components)
- **Avoid duplication that requires identical fixes in multiple places**

### 2. Architecture
- Prefer explicit, flat code over clever abstractions
- Avoid unnecessary indirection and deep hierarchies
- Minimize coupling between modules
- Make dependencies obvious

### 3. Functions and Modules
- Keep control flow linear and simple
- Use focused, reasonably-sized functions
- Avoid deeply nested logic
- Pass state explicitly rather than relying on globals

### 4. Naming and Comments
- Use clear, descriptive names
- Comment to explain *why*, not *what*
- Document assumptions, invariants, and external requirements
- Let code be self-documenting where possible

### 5. Logging and Errors
- Log important operations and state changes
- Make errors explicit and informative
- Include context in error messages
- Use structured logging at system boundaries

### 6. Maintainability
- Write code so any module can be rewritten without breaking the system
- Use clear, declarative configuration files (JSON/YAML/TOML)
- Avoid tight coupling between components
- Design for future modification

### 7. Platform Conventions
- Follow framework and platform conventions directly
- Don't over-abstract platform features
- Use idioms native to your stack

### 8. Modifications
- When extending code, follow existing patterns consistently
- Prefer full-file rewrites for clarity when making substantial changes
- Keep the codebase coherent in style and approach

### 9. Quality
- Write deterministic, testable code
- Keep tests simple and focused on observable behavior
- Favor predictable outcomes over clever solutions
