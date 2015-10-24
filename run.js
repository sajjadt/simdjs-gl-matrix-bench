load('gl-matrix.js');
load('base.js');
if ('SIMD' in this)
    runTests(tests);
else
    console.log("SIMD is not available");
