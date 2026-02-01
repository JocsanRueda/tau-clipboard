use std::thread;
use std::time::Duration;

use tauri::{PhysicalPosition};

// Hide the window
#[tauri::command]
pub fn hide_window_command(window: tauri::WebviewWindow) {
    if let Ok(is_visible) = window.is_visible() {
        if !is_visible {
            return;
        }
    }

    let _ = window.hide();
}

// Show the window
pub fn show_window_command(window: tauri::WebviewWindow) {
    if let Ok(true) = window.is_visible() {
        if let Ok(true) = window.is_focused() {
            return;
        }
    }
    set_position_window(window.clone());
    let _ = window.unminimize();
    let _ = window.show();
    let _ = window.set_always_on_top(true);
    let _ = window.set_focus();

    let _ = tauri::async_runtime::spawn(async move {
        thread::sleep(Duration::from_millis(100));
        let _ = window.set_always_on_top(false);
    });
}

pub fn resize_window(window: &tauri::WebviewWindow, width: f64, height: f64) {
    println!("Resizing window to width: {}, height: {}", width, height);

    let _ = window.set_size(tauri::Size::Logical(tauri::LogicalSize { width, height }));
}

// Resize the window
#[tauri::command]
pub fn resize_window_command(window: tauri::WebviewWindow, width: f64, height: f64) {
    resize_window(&window, width, height);
}



// Get mouse position
pub fn get_mouse_position(window: tauri::WebviewWindow) -> PhysicalPosition<f64> {
    match window.cursor_position() {
        Ok(position) => position,
        Err(_) => PhysicalPosition { x: 0.0, y: 0.0 }, 
    }
}

pub fn set_position_window(window: tauri::WebviewWindow) {

    println!("Setting window position based on mouse cursor");
    let position = get_mouse_position(window.clone());

    

    
    let _ = window.set_position(
    tauri::Position::Physical(
        tauri::PhysicalPosition { x: position.x as i32, y: 300 }
    ));
}