require('fake-indexeddb/auto');

const { Crypto } = require('node-webcrypto-ossl');
const { TextEncoder, TextDecoder } = require('util');

global['crypto'] = new Crypto();
global['TextEncoder'] = TextEncoder;
global['TextDecoder'] = TextDecoder;
