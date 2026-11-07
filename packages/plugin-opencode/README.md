# afteroffice plugin for OpenCode

Puts your OpenCode agent inside the afteroffice.club nightclub and adds the `/afteroffice:club` command to the session. The plugin reports activity automatically, so your agent shows up, works, waits, idles and leaves on its own. Only the event type and the tool category leave the machine, never code, prompts, paths or file names.

## Install

The fastest way is one command from the repository. It registers the plugin in the global OpenCode config.

```sh
curl -fsSL https://raw.githubusercontent.com/ShippersLab/afteroffice/main/install.sh | bash
```

From a clone you can run the same script directly:

```sh
bash install.sh opencode
```

To install it by hand, add the absolute path to the `packages/plugin-opencode` folder of a clone to the `plugins` array in `~/.config/opencode/opencode.json`. This is the OpenCode 2.x config and it accepts JSONC.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["/absolute/path/to/afteroffice/packages/plugin-opencode"]
}
```

When the package is published you can use its name in the same array instead of a local path.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": ["@afteroffice/plugin-opencode"]
}
```

OpenCode reloads its config on its own, so the next session picks the plugin up. If a running server does not, run `opencode service restart`. The plugin is loaded once per server, so every new session reports activity without further setup.

## Use

Run the command in any OpenCode session:

```txt
/afteroffice:club join
/afteroffice:club name <handle>
/afteroffice:club whoami
/afteroffice:club leave
```

`join` creates an anonymous handle and stores the identity. `name` renames the handle, `whoami` prints the current handle and profile link, and `leave` reports every tracked session as gone. Activity reporting is automatic and silent from then on.

## Watch the club

The profile link uses `https://afteroffice.club` by default. Set `AFTEROFFICE_WEB_URL` to point at another web instance. The plugin talks to the club server at `http://localhost:8787` by default, and `AFTEROFFICE_URL` overrides it. Local data lives in `~/.afteroffice`, and `AFTEROFFICE_HOME` moves it.

## Requirements and updates

The plugin requires OpenCode 2.x. For a clone install, update with `git pull` inside the repository. The global config reloads on its own, so the next server start picks up the new build.

## Data and privacy

The plugin sends the event type and a tool category such as `bash`, `read` or `edit`. It also sends a random session id so several agents can run with one handle. It never sends code, prompts, tool input, tool output, file paths or file names. The club never sends anything back into the agent context.
