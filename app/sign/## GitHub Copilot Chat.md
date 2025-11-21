## GitHub Copilot Chat

- Extension Version: 0.32.1 (prod)
- VS Code: vscode/1.105.1
- OS: Linux
- Remote Name: codespaces

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.121.5 (35 ms)
- DNS ipv6 Lookup: Error (21 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (339 ms)
- Electron fetch: Unavailable
- Node.js https: HTTP 200 (511 ms)
- Node.js fetch (configured): HTTP 200 (268 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.112.21 (2 ms)
- DNS ipv6 Lookup: Error (5 ms): getaddrinfo ENOTFOUND api.individual.githubcopilot.com
- Proxy URL: None (99 ms)
- Electron fetch: Unavailable
- Node.js https: HTTP 200 (1320 ms)
- Node.js fetch (configured): HTTP 200 (141 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).