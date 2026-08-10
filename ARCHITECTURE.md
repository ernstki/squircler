## Architecture and implementation nodes

_Hat tip to [Alex Kladov][alexblog] for the idea._

## How is window geometry stored?

Window geometry is managed by the `tauri-plugin-window-state` plugin. Here's
the relevant code from `src-tauri/src/main.rs`:

```rust
fn main() {
  let context = generate_context!();
  Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
    // other pluginses…
    .run(context)
    .expect("error while running tauri application");
```

On a clean exit, window geometry is saved to a hidden file named
`.window-state` located in the application's config directory (_e.g._,
`~/.config/io.github.ernstki.squircler/.window-state` on Linux).

Yeah, hidden. It wasn't _my_ idea.

[alexblog]: https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html
