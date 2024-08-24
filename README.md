# SURUME-local

SURUME-local is Microsoft Teams Chat utility tool, assuming go on local server.
![](/resources/logo.png)

# feature
- broadcast post
- get belongs chat info
  - member
  - log

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
- `files.read.all` ! NOT YET IMPREMENTED
- `files.readwrite.all` ! NOT YET IMPREMENTED

SURUME-local envs are in `.tool-versions`, using [mise](https://mise.jdx.dev/).