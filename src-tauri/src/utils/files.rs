use crate::utils::path::get_local_data_path;
use image::DynamicImage;
use std::fs::{self, copy, File};
use std::path::PathBuf;
use tauri::image::Image;
use tauri::{self};
use tauri_plugin_clipboard_manager::ClipboardExt;

pub fn save_thumbnail(image: &DynamicImage, file_name: &str) {
    let local_data = match get_local_data_path() {
        Ok(path) => path,
        Err(_) => {
            eprintln!("Failed to get local data path");
            return;
        }
    };

    let width = image.width();
    let height = image.height();

    //thumbail
    let thumbail_file_name = format!("thumb_{}.bmp", file_name);
    let thumbail_file_path = format!("{}/images/thumbs/{}", local_data, thumbail_file_name);
    let thumbail_path = PathBuf::from(&thumbail_file_path);

    if let Some(parent) = thumbail_path.parent() {
        if let Err(e) = fs::create_dir_all(parent) {
            eprintln!("Failed to create thumbnail directory: {}", e);
            return;
        }
    }

    let (new_width, new_height) = if width > 300 {
        let ratio = height as f32 / width as f32;
        (300, (300.0 * ratio) as u32)
    } else {
        (width, height)
    };

    let thumb = image.thumbnail(new_width, new_height);

    if let Err(e) = thumb.save(&thumbail_path) {
        // This is not a critical failure. The main image might still save.
        // We log the error but still return the file_name.
        eprintln!("Failed to save thumbnail file: {}", e);
    }
}

pub fn copy_image(origin_path: &PathBuf, file_name: &str) {
    let local_data = get_local_data_path().unwrap();

    let file_path = format!("{}/images/{}.png", local_data, file_name);

    let path = PathBuf::from(&file_path);

    if let Some(parent) = path.parent() {
        if let Err(e) = fs::create_dir_all(parent) {
            eprintln!("Failed to create images directory: {}", e);
            return;
        }
    }

    let _ = match File::create(&path) {
        Ok(f) => f,
        Err(e) => {
            eprintln!("Failed to create image file [{}]: {}", path.display(), e);
            return;
        }
    };

    if let Err(e) = copy(&origin_path, &path) {
        eprintln!("Failed to copy file: {}", e);
    }
}

pub fn delete_image(file_name: String) {
    std::thread::spawn(move || {
        let local_data = get_local_data_path().unwrap();

        let file_path = format!("{}/images/{}.png", local_data, file_name);

        let file_thumb_path = format!("{}/images/thumbs/thumb_{}.bmp", local_data, file_name);

        let path = PathBuf::from(file_path);

        let path_thumb = PathBuf::from(file_thumb_path);

        if path.exists() {
            if let Err(e) = fs::remove_file(path) {
                eprintln!("Error deleting file: {}", e);
            }
        } else {
            eprintln!("File not found: {}", file_name);
        }

        if path_thumb.exists() {
            if let Err(e) = fs::remove_file(path_thumb) {
                eprintln!("Error deleting thumbnail: {}", e);
            }
        } else {
            eprintln!("Thumbnail not found: {}", file_name);
        }
    });
}

pub fn delete_all_images() {
    std::thread::spawn(move || {
        let local_data = get_local_data_path().unwrap();

        let images_path = format!("{}/images", local_data);

        let path = PathBuf::from(images_path);

        if path.exists() {
            if let Err(e) = fs::remove_dir_all(path) {
                eprintln!("Error deleting all images: {}", e);
            }
        }
    });
}

#[tauri::command]
pub async fn write_image_command(app: tauri::AppHandle, file_name: String) -> Result<(), String> {
    let task_result = tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
        let local_data_path =
            get_local_data_path().map_err(|e| format!("Error al obtener data path: {}", e))?;

        let full_path = format!("{}/images/{}.png", local_data_path, file_name);
        

        let img =
            image::open(&full_path).map_err(|e| format!("Error al abrir la imagen: {}", e))?;

        let rgba = img.to_rgba8();
        let (w, h) = (img.width(), img.height());
        let raw = rgba.into_raw();

        let tauri_img = Image::new(&raw, w, h);

        app.clipboard()
            .write_image(&tauri_img)
            .map_err(|e| format!("Error al escribir al portapapeles: {:?}", e))?;

        Ok(())
    })
    .await;

    match task_result {
        Ok(Ok(_)) => Ok(()),
        Ok(Err(e)) => Err(e),
        Err(e) => Err(format!("Error al ejecutar la tarea: {}", e)),
    }
}



#[cfg(test)]
mod tests {
    use super::*;

    

    #[test]
    pub fn save_thumbnail_test() {
        let local_data = get_local_data_path().unwrap();
        
        let img = image::DynamicImage::new_rgb8(800, 600);
        save_thumbnail(&img, "test_image");
    }

}