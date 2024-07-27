# SURUME-local

SURUME-local is Microsoft Teams Chat utility tool, assuming go on local server.

# feature
- broadcast
- get belongs chat info

# usage
You need register app for Azure Entra ID (former Active Directory) and prepare below info:

- Client ID
- Authority(your organization domain)
- localhost port number
- Redirect URI


SURUME-local use Microsoft Teams APIs(MS Graph API), so the app must have these scopes:

- `user.read`
- `chat.read`
- `chat.readbasic`
- `chat.readwrite`
- `files.read.all`
- `files.readwrite.all`

SURUME-local envs are in `.tool-versions`, using [mise](https://mise.jdx.dev/).