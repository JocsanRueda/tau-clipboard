use crate::constants::clipboard_key::{HISTORY, SETTINGS};
use crate::structures::Settings;
use crate::utils::{delete_all_images, delete_image};
use crate::AppStore;
use serde_json::json;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::AppHandle;
use tauri::Wry;
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_store::Store;

// Save the current state of the store
pub fn save_store(store: &Arc<Store<Wry>>, history: &Vec<serde_json::Value>) {
    store.set(HISTORY, json!(history));
    store.save().expect("Failed to save store");
}

// get settings from the store
pub fn get_settings(store: &Arc<Store<Wry>>) -> Settings {
    store
        .get(SETTINGS)
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_else(default_settings)
}

fn default_settings() -> Settings {
    Settings {
        expiration_time: 24,
        keyboard_shortcut: "Ctrl+H".to_string(),
        search_shortcut: "Ctrl+F".to_string(),
        delete_all_shortcut: "Ctrl+Del".to_string(),
        sort_shortcut: "Ctrl+S".to_string(),
        language: "es".to_string(),
        item_limit: 200,
        rounded_window_corners: false,
        font_size: "12".to_string(),
        item_order: "ascending".to_string(),
        horizontal_size: 380.0,
        vertical_size: 440.0,
        font: "default".to_string(),
    }
}

// Clean up the store
pub fn clean_store(
    store: &Arc<Store<Wry>>,
    app_handle: AppHandle,
    expiration_secs: u64,
) -> Vec<serde_json::Value> {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs();

    let mut history: Vec<serde_json::Value> = store
        .get(HISTORY)
        .unwrap_or(json!([]))
        .as_array()
        .cloned()
        .unwrap_or_default();

    let last_item = history.last().cloned();

    let paths_to_delete = clean_history_logic(&mut history, expiration_secs, now);
    for path in paths_to_delete {
        delete_image(path);
    }

    store.set(HISTORY, json!(history));
    store.save().expect("Failed to save store");

    if let Some(last) = last_item {
        if !history.contains(&last) {
            if let Err(e) = app_handle.clipboard().clear() {
                eprintln!("Failed to clear clipboard: {}", e);
            }
        }
    }

    history
}

fn clean_history_logic(history: &mut Vec<serde_json::Value>, expiration_secs: u64, now: u64) -> Vec<String> {
    let mut paths_to_delete = Vec::new();
    history.retain(|item| {
        let is_recent = item
            .get("timestamp")
            .and_then(|ts| ts.as_u64())
            .map(|ts| now.saturating_sub(ts) < expiration_secs)
            .unwrap_or(true);

        let is_fixed = item
            .get("fixed")
            .and_then(|fixed| fixed.as_bool())
            .unwrap_or(true);

        let path = item
            .get("path")
            .and_then(|path| path.as_str())
            .map(|path| path.to_string());

        let keep = is_recent || is_fixed;

        if !keep {
            if let Some(p) = path {
                paths_to_delete.push(p);
            }
        }
        keep
    });
    paths_to_delete
}

// Save the current state of the store
#[tauri::command]
pub fn save_store_command(state: tauri::State<'_, AppStore>, history: Vec<serde_json::Value>) {
    let store = state.0.lock().unwrap();

    store.set(HISTORY, json!(history));
    store.save().expect("Failed to save store");
}

// Update an item
#[tauri::command]
pub fn update_item_command(
    state: tauri::State<'_, AppStore>,
    global_history: tauri::State<'_, Arc<Mutex<Vec<serde_json::Value>>>>,
    index: usize,
    property_name: String,
    new_value: serde_json::Value,
) {
    println!("updating item at index {} ", index);
    let store = state.0.lock().unwrap();
    let mut history = global_history.lock().unwrap();

    if update_item_logic(&mut history, index, &property_name, new_value) {
        store.set(HISTORY, json!(&*history));
        store.save().expect("Failed to save store");
    } else {
        println!("Index out of range: {}", index);
    }
}

fn update_item_logic(history: &mut Vec<serde_json::Value>, index: usize, property_name: &str, new_value: serde_json::Value) -> bool {
    if index < history.len() {
        history[index][property_name] = new_value;
        true
    } else {
        false
    }
}

// delete an item
#[tauri::command]
pub fn delete_item_command(
    state: tauri::State<'_, AppStore>,
    global_history: tauri::State<'_, Arc<Mutex<Vec<serde_json::Value>>>>,
    index: usize,
) {
    println!("Deleting item at index: {}", index);
    let store = state.0.lock().unwrap();
    let mut history = global_history.lock().unwrap();

    match delete_item_logic(&mut history, index) {
        Ok(path_opt) => {
            if let Some(path) = path_opt {
                delete_image(path);
            }
            store.set(HISTORY, json!(&*history));
            store.save().expect("Failed to save store");
        }
        Err(_) => println!("Index out of range: {}", index),
    }
}

fn delete_item_logic(history: &mut Vec<serde_json::Value>, index: usize) -> Result<Option<String>, ()> {
    if index < history.len() {
        let removed = history.remove(index);
        Ok(removed.get("path").and_then(|p| p.as_str()).map(|s| s.to_string()))
    } else {
        Err(())
    }
}

//Delete all items
#[tauri::command]
pub fn delete_all_items_command(
    state: tauri::State<'_, AppStore>,
    global_history: tauri::State<'_, Arc<Mutex<Vec<serde_json::Value>>>>,
) {
    let store = state.0.lock().unwrap();
    let mut history = global_history.lock().unwrap();

    delete_all_items_logic(&mut history);

    store.set(HISTORY, json!(&*history));
    store.save().expect("Failed to save store");

    delete_all_images();
}

fn delete_all_items_logic(history: &mut Vec<serde_json::Value>) {
    let filtered: Vec<serde_json::Value> = history
        .drain(..)
        .filter(|item| item["fixed"] == true)
        .collect();
    history.extend(filtered);
}

//Fixed item
#[tauri::command]
pub fn fixed_item_command(
    state: tauri::State<'_, AppStore>,
    global_history: tauri::State<'_, Arc<Mutex<Vec<serde_json::Value>>>>,
    index: usize,
    new_value: bool,
) {
    let store = state.0.lock().unwrap();
    let mut history = global_history.lock().unwrap();

    if fixed_item_logic(&mut history, index, new_value) {
        store.set(HISTORY, json!(&*history));
        store.save().expect("Failed to save store");
    } else {
        println!("Index out of range: {}", index);
    }
}

fn fixed_item_logic(history: &mut Vec<serde_json::Value>, index: usize, new_value: bool) -> bool {
    if index < history.len() {
        history[index]["fixed"] = json!(new_value);
        true
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_default_settings() {
        let settings = default_settings();
        assert_eq!(settings.expiration_time, 24);
        assert_eq!(settings.language, "es");
    }

    #[test]
    fn test_clean_history_logic() {
        let now = 1000;
        let expiration = 100;
        let mut history = vec![
            json!({ "timestamp": 950, "fixed": false, "path": "keep_recent.png" }), // 1000 - 950 = 50 < 100 -> Keep
            json!({ "timestamp": 800, "fixed": false, "path": "delete_old.png" }),  // 1000 - 800 = 200 > 100 -> Delete
            json!({ "timestamp": 800, "fixed": true, "path": "keep_fixed.png" }),   // Old but fixed -> Keep
            json!({ "fixed": false }), // No timestamp -> Keep (default behavior)
        ];

        let deleted = clean_history_logic(&mut history, expiration, now);

        assert_eq!(history.len(), 3);
        assert_eq!(deleted.len(), 1);
        assert_eq!(deleted[0], "delete_old.png");
        assert_eq!(history[0]["path"], "keep_recent.png");
        assert_eq!(history[1]["path"], "keep_fixed.png");
    }

    #[test]
    fn test_update_item_logic() {
        let mut history = vec![json!({"val": 1})];
        let success = update_item_logic(&mut history, 0, "val", json!(2));
        assert!(success);
        assert_eq!(history[0]["val"], 2);

        let fail = update_item_logic(&mut history, 1, "val", json!(3));
        assert!(!fail);
    }

    #[test]
    fn test_delete_item_logic() {
        let mut history = vec![json!({"path": "img1.png"}), json!({"path": "img2.png"})];
        let path = delete_item_logic(&mut history, 0);
        assert_eq!(path, Ok(Some("img1.png".to_string())));
        assert_eq!(history.len(), 1);
        assert_eq!(history[0]["path"], "img2.png");

        let fail = delete_item_logic(&mut history, 5);
        assert!(fail.is_err());
    }

    #[test]
    fn test_delete_all_items_logic() {
        let mut history = vec![
            json!({"fixed": true, "id": 1}),
            json!({"fixed": false, "id": 2}),
            json!({"fixed": true, "id": 3}),
        ];
        delete_all_items_logic(&mut history);
        assert_eq!(history.len(), 2);
        assert_eq!(history[0]["id"], 1);
        assert_eq!(history[1]["id"], 3);
    }

    #[test]
    fn test_fixed_item_logic() {
        let mut history = vec![json!({"fixed": false})];
        let success = fixed_item_logic(&mut history, 0, true);
        assert!(success);
        assert_eq!(history[0]["fixed"], true);
    }
}
