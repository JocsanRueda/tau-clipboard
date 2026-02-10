use std::fs;
use std::process::Command;

pub fn get_gnome_font() -> String {
    let output = Command::new("gsettings")
        .args(&["get", "org.gnome.desktop.interface", "font-name"])
        .output()
        .expect("Failed to execute gsettings command");

    if output.status.success() {
        let font_name = String::from_utf8_lossy(&output.stdout).trim().to_string();
        font_name
    } else {
        "DefaultFont".to_string()
    }
}

pub fn get_kde_font() -> String {
    let config_path = dirs::home_dir()
        .unwrap_or_default()
        .join(".config")
        .join("kdeglobals");

    if let Ok(contents) = fs::read_to_string(config_path) {
        for line in contents.lines() {
            if line.starts_with("font=") {
                return line["font=".len()..].trim().to_string();
            }
        }
    }
    "DefaultFont".to_string()
}


#[tauri::command]
pub fn list_font() -> Result<Vec<String>, String> {
    use std::collections::BTreeSet;
    use std::process::Command;

    let output = Command::new("fc-list")
        .arg("--format")
        .arg("%{family}\n")
        .output()
        .map_err(|e| format!("Failed to execute fc-list command: {}", e))?;

    if !output.status.success() {
        return Err("fc-list command failed".to_string());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut set = BTreeSet::new();
    for line in stdout.lines() {
        for family in line.split(',') {
            let f = family.trim().trim_matches('"');
            if !f.is_empty() {
                set.insert(f.to_string());
            }
        }
    }

    Ok(set.into_iter().collect())
}
