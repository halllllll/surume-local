# SURUME-local

SURUME-local is Microsoft Teams Chat broadcast tool, assuming go on local server.

# usage
You need register app for Azure(Entra ID) Active Directory and prepare below info:

- Client ID
- Authority(your organization domain)
- localhost port number


SURUME-local use Microsoft Teams APIs(MS Graph API), so the app must have these scopes:

- `user.read`
- `chat.read`
- `chat.readbasic`
- `chat.readwrite`
- `files.read.all`
- `files.readwrite.all`
