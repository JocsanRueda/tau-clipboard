use crate::constants::clipboard_key::{IMAGE, TEXT};
use crate::utils::data::get_data_now;
use crate::utils::string::normalize_string;
use serde_json::json;
pub fn add_unique(array: &mut Vec<serde_json::Value>, value: &str,id:&str) {
    let last_value = normalize_string(value);

    let timestamp = get_data_now();

    let new_item = json!({
        "value": last_value,
        "type": TEXT,
        "fixed": false,
        "path": null,
        "timestamp": timestamp,
        "id": id
    });

    if !array
        .iter()
        .any(|item| item["value"] == new_item["value"] && item["type"] == new_item["type"])
    {
        array.push(new_item);
    }
}

pub fn add_image(array: &mut Vec<serde_json::Value>, id: String ){
    let last_value = normalize_string(IMAGE);

    let timestamp = get_data_now();

    let new_item = json!({
        "id":id,
        "value": last_value,
        "type": IMAGE,
        "fixed": false,
        "path": format!("image_{}", timestamp),
        "timestamp": timestamp
    });

    array.push(new_item);
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::Value;

    #[test]
    fn test_add_unique() {
        let mut array: Vec<Value> = Vec::new();
        let value = "test_value";
        let id = "123";

        add_unique(&mut array, value, id);

        assert_eq!(array.len(), 1);
        assert_eq!(array[0]["value"], "test_value");
        assert_eq!(array[0]["type"], TEXT);
        assert_eq!(array[0]["id"], "123");

        // Adding the same value again should not increase the array size
        add_unique(&mut array, value, id);
        assert_eq!(array.len(), 1);
    }

    #[test]
    fn test_add_image() {
        let mut array: Vec<Value> = Vec::new();

        add_image(&mut array, "123".to_string());

        assert_eq!(array.len(), 1);
        assert_eq!(array[0]["type"], IMAGE);
        assert!(array[0]["path"].as_str().unwrap().starts_with("image_"));

        // Adding another image should increase the array size
        add_image(&mut array, "124".to_string());
        assert_eq!(array.len(), 2);
    }
}
