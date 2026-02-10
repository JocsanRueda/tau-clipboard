use font_kit::source::SystemSource;

#[tauri::command]
pub fn get_system_font_command() -> Vec<String> {
    let source = SystemSource::new();

    match source.all_families() {
        Ok(families) => {
            let mut unique_families = families;
            unique_families.sort();
            unique_families.insert(0, "default".to_string());
            unique_families
        }
        Err(_) => {
            vec!["sans-serif".to_string()]
        }
    }
}
