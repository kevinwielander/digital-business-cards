# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in CardGen, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **kevin@wielander.dev** (replace with your actual email)

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix**: As soon as possible, depending on severity

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Security Best Practices

When self-hosting CardGen:

- Never commit `.env.local` or expose your `SUPABASE_SERVICE_ROLE_KEY`
- Keep Supabase RLS policies enabled
- Use HTTPS in production
- Regularly update dependencies
