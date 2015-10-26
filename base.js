mat4.random = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    for( var i = 0; i < 16; ++i)
        out[i] = Math.random();
    return out;
};

var config = {
    runCount : 20,
    internalRunCount : 500000
}

var tests = [
  { name : 'Invert',
    scalarFunc: function(count) {
        var m = mat4.random();
        var out = new Float32Array(16);
        var start = Date.now();
        for (var i = 0; i < count; ++i) {
            mat4.scalar.invert(out, m);
        }
        return Date.now()-start;
    },
    simdFunc: function(count) {
        var m = mat4.random();
        var out = new Float32Array(16);
        var start = Date.now();
        for (var i = 0; i < count; ++i) {
            mat4.SIMD.invert(out, m);
        }
        return Date.now()-start;
   }
 },
  { name : 'Scale',
    scalarFunc: function(count) {
        var m = mat4.random();
        var out = new Float32Array(16);
        var v = new Float32Array(3);
        v[0] = Math.random(); v[1] = Math.random(); v[2] = Math.random();;
        var start = Date.now();
        for (var i = 0; i < count; ++i) {
          mat4.scalar.scale(out, m, v);
        }
        return Date.now()-start;
    },
    simdFunc: function(count) {
        var m = mat4.random();
        var out = new Float32Array(16);
        var v = new Float32Array(3);
        v[0] = Math.random(); v[1] = Math.random(); v[2] = Math.random();;
        var start = Date.now();
        for (var i = 0; i < count; ++i) {
            mat4.SIMD.scale(out, m, v);
        }
        return Date.now()-start;
   }
  },
  { name : 'Adjoint',
    scalarFunc: function(count) {
        var m = mat4.random();
        var out = new Float32Array(16);
        var start = Date.now();
        for (var i = 0; i < count; ++i) {
          mat4.scalar.adjoint(out, m);
        }
        return Date.now()-start;
    },
    simdFunc: function(count) {
        var m = mat4.random();
        var out = new Float32Array(16);
        var start = Date.now();
        for (var i = 0; i < count; ++i) {
            mat4.SIMD.adjoint(out, m);
        }
        return Date.now()-start;
   }
 },

{ name : 'Transpose',
  scalarFunc: function(count) {
      var m = mat4.random();
      var out = new Float32Array(16);
      var start = Date.now();
      for (var i = 0; i < count; ++i) {
        mat4.scalar.transpose(out, m);
      }
      return Date.now()-start;
  },
  simdFunc: function(count){
      var m = mat4.random();
      var out = new Float32Array(16);
      var start = Date.now();
      for (var i = 0; i < count; ++i) {
          mat4.SIMD.transpose(out, m);
      }
      return Date.now()-start;
 }
},
{ name : 'Rotation (X-Axis)',
  scalarFunc: function(count) {
      var m = mat4.random();
      var out = mat4.random();
      var a = Math.PI/6;
      var start = Date.now();
      for (var i = 0; i < count; ++i) {
        mat4.scalar.rotateX(out, m, a);
      }
      return Date.now()-start;
  },
  simdFunc: function(count){
      var m = mat4.random();
      var out = new Float32Array(16);
      var a = Math.PI/6;
      var start = Date.now();
      for (var i = 0; i < count; ++i) {
          mat4.SIMD.rotateX(out, m, a);
      }
      return Date.now()-start;
 }
 },
 { name : 'Translate',
   scalarFunc: function(count) {
       var out = new Float32Array(16);
       var m = mat4.random();
       var v = new Float32Array(3);
       v[0] = Math.random(); v[1] = Math.random(); v[2] = Math.random();
       var start = Date.now();
       for (var i = 0; i < count; ++i) {
         mat4.scalar.translate(out, m, v);
       }
       return Date.now()-start;
   },
   simdFunc: function(count){
       var out = new Float32Array(16);
       var m = mat4.random();
       var v = new Float32Array(3);
       v[0] = Math.random(); v[1] = Math.random(); v[2] = Math.random();
       var start = Date.now();
       for (var i = 0; i < count; ++i) {
           mat4.SIMD.translate(out, m, v);
       }
       return Date.now()-start;
  }
},
{ name : 'Multiply',
  scalarFunc: function(count) {
      var m = mat4.random();
      var out = new Float32Array(16);
      var start = Date.now();
      for (var i = 0; i < count; ++i) {
        mat4.scalar.multiply(out, m, m);
      }
      return Date.now()-start;
  },
  simdFunc: function(count){
      var m = mat4.random();
      var out = new Float32Array(16);
      var start = Date.now();
      for (var i = 0; i < count; ++i) {
          mat4.SIMD.multiply(out, m, m);
      }
      return Date.now()-start;
 }
}];

function runTest(name, f) {

  var totalTime = 0;
  var minTime = +Infinity;
  var maxTime = -Infinity;

  for(var i = 0; i < config.runCount; ++i) {
    var time = f(config.internalRunCount);
    minTime = Math.min(minTime, time);
    maxTime = Math.max(maxTime, time);
    totalTime += time;
  }

  var avg = totalTime / config.runCount;
  console.log(name + ' - Avg: ' + avg + ' ms , Min: ' + minTime + ' ms, Max: ' + maxTime + ' ms');
}

function runTests(kernels) {
    for(var i = 0; i < kernels.length; ++i){
        runTest(kernels[i].name + " (Scalar)", kernels[i].scalarFunc);
        runTest(kernels[i].name + " (SIMD)", kernels[i].simdFunc);
    }
}
