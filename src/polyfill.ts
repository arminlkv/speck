require('cross-fetch/polyfill');
global.Blob = require('buffer').Blob;
const { FormData: FormDataPolyfill } = require('formdata-node');
global.FormData = FormDataPolyfill;
global.ReadableStream = require('stream/web').ReadableStream;
