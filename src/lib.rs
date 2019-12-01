extern crate cfg_if;
extern crate rand;
extern crate wasm_bindgen;

mod utils;

use cfg_if::cfg_if;
use wasm_bindgen::prelude::*;

use rand::seq::SliceRandom;

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn driedel_spin() -> String {
    let sides = ['\u{05e0}', '\u{05d2}', '\u{05d4}', '\u{05e9}'];
    let mut rng = rand::thread_rng();
    match sides.choose(&mut rng) {
        Some(choice) => choice.to_string(),
        None => String::from("Unknown"),
    }
}
