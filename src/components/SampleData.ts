export const sampleData: Record<string, string> = {
  "Simple Object": JSON.stringify({
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    isActive: true,
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001"
    },
    hobbies: ["reading", "coding", "hiking"],
    spouse: null
  }, null, 2),

  "Array of Objects": JSON.stringify([
    { id: 1, name: "Alice", role: "admin", permissions: ["read", "write", "delete"] },
    { id: 2, name: "Bob", role: "editor", permissions: ["read", "write"] },
    { id: 3, name: "Charlie", role: "viewer", permissions: ["read"] }
  ], null, 2),

  "Nested Structure": JSON.stringify({
    company: "Acme Corp",
    founded: 1985,
    departments: {
      engineering: {
        head: "Jane Smith",
        teams: {
          frontend: { members: 12, tech: ["React", "TypeScript", "Next.js"] },
          backend: { members: 8, tech: ["Node.js", "Python", "Go"] },
          devops: { members: 4, tech: ["Docker", "Kubernetes", "AWS"] }
        }
      },
      marketing: {
        head: "Bob Johnson",
        budget: 500000,
        campaigns: [
          { name: "Q1 Launch", status: "completed", roi: 2.5 },
          { name: "Summer Sale", status: "active", roi: null }
        ]
      }
    },
    metadata: {
      lastUpdated: "2026-02-17T10:00:00Z",
      version: "2.1.0",
      flags: { beta: true, deprecated: false }
    }
  }, null, 2),

  "Mixed Types": JSON.stringify({
    string: "Hello, World!",
    number: 42,
    float: 3.14159,
    negative: -17,
    exponent: 1.5e10,
    boolean_true: true,
    boolean_false: false,
    null_value: null,
    empty_object: {},
    empty_array: [],
    nested_array: [[1, 2], [3, 4], [5, 6]],
    unicode: "こんにちは世界 🌍",
    escaped: "Line 1\nLine 2\tTabbed",
    long_string: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }, null, 2)
};

export const defaultSample = "Simple Object";
