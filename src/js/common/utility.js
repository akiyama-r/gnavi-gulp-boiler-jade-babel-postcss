/**
 * common.js - utility.js
 * Author: sekiya
 * ---------------------------------------------------------------------- */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "Utility", "vars": "local" }] */

class Utility {
  static console(value) {
    const str = value || null
    console.log(str)
  }

  static sampleUtility1() {
    const hoge = 1
    const huga = 2
    return hoge + huga
  }
}

