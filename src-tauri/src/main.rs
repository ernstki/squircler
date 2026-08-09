// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{generate_context, Builder};

fn main() {
  let context = generate_context!();

  Builder::default()
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .run(context)
    .expect("error while running tauri application");
}

//fn main() {
//    squircler_lib::run()
//}
