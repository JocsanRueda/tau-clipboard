use std::time::{SystemTime, UNIX_EPOCH};

pub fn get_data_now() -> u64 {
    let start = SystemTime::now();
    let timestamp = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs();

    timestamp
}


#[cfg(test)]

mod tests{


    use super::*;


    #[test]
    fn test_get_data_now(){
        let timestamp= get_data_now();

        assert!(timestamp>0);
    }
}