mat4.random = function() {
    var out = new glMatrix.ARRAY_TYPE(16);
    for( var i = 0; i < 16; ++i)
        out[i] = Math.random();
    return out;
};

var config = {
    runCount : 20,
    internalRunCount : 250000,
    matrices : []
}

var tests = [
  { name : 'Invert',
    scalarFunc: function(count, matrices) {
        var out = new Float32Array(16);
        var m = matrices[0];
        var start = performance.now();
        for (var i = 0; i < count; ++i) {
            mat4.scalar.invert(out, m);
        }
        return performance.now() - start;
    },
    simdFunc: function(count, matrices) {
        var out = new Float32Array(16);
        var m = matrices[0];
        var start = performance.now();
        for (var i = 0; i < count; ++i) {
            mat4.SIMD.invert(out, m);
        }
        return performance.now() - start;
   }
 },
  { name : 'Scale',
    scalarFunc: function(count, matrices) {
        var out = new Float32Array(16);
        var v = new Float32Array(3);
        v[0] = 1.1; v[1] = 2.2; v[2] = 3.3;
        var len = matrices.length;
        var m = matrices[0];
        var start = performance.now();
        for (var i = 0; i < count; ++i) {
            mat4.scalar.scale(out, m, v);
        }
        return performance.now() - start;
    },
    simdFunc: function(count, matrices) {
        var out = new Float32Array(16);
        var v = new Float32Array(3);
        v[0] = 1.1; v[1] = 2.2; v[2] = 3.3;
        var len = matrices.length;
        var m = matrices[0];
        var start = performance.now();
        for (var i = 0; i < count; ++i) {
            mat4.SIMD.scale(out, m, v);
        }
        return performance.now() - start;
   }
  },
  { name : 'Adjoint',
    scalarFunc: function(count, matrices) {
        var out = new Float32Array(16);
        var len = matrices.length;
        var m = matrices[0];
        var start = performance.now();
        for (var i = 0; i < count; ++i) {
            mat4.scalar.adjoint(out, m);
        }
        return performance.now() - start;
    },
    simdFunc: function(count, matrices) {
        var time = 0;
        var out = new Float32Array(16);
        var len = matrices.length;
        var m = matrices[0];
        var start = performance.now();
        for (var i = 0; i < count; ++i) {
            mat4.SIMD.adjoint(out, m);
        }
        return performance.now() - start;
   }
 },

{ name : 'Transpose',
  scalarFunc: function(count, matrices) {
      var out = new Float32Array(16);
      var len = matrices.length;
      var m = matrices[0];
      var start = performance.now();
      for (var i = 0; i < count; ++i) {
          mat4.scalar.transpose(out, m);
      }
      return performance.now() - start;
  },
  simdFunc: function(count, matrices){
      var out = new Float32Array(16);
      var len = matrices.length;
      var m = matrices[0];
      var start = performance.now();
      for (var i = 0; i < count; ++i) {
          mat4.SIMD.transpose(out, m);
      }
      return performance.now() - start;
 }
},
{ name : 'Rotation (X-Axis)',
  scalarFunc: function(count, matrices) {
      var out = mat4.random();
      var a = Math.PI/6;
      var m = matrices[0];
      var start = performance.now();
      for (var i = 0; i < count; ++i) {
          mat4.scalar.rotateX(out, m, a);
      }
      return performance.now() - start;
  },
  simdFunc: function(count, matrices){
      var out = new Float32Array(16);
      var a = Math.PI/6;
      var m = matrices[0];
      var start = performance.now();
      for (var i = 0; i < count; ++i) {
          mat4.SIMD.rotateX(out, m, a);
      }
      return performance.now() - start;
 }
 },
 { name : 'Translate',
   scalarFunc: function(count, matrices) {
       var out = new Float32Array(16);
       var v = new Float32Array(3);
       v[0] = Math.random(); v[1] = Math.random(); v[2] = Math.random();
       var m = matrices[0];
       var start = performance.now();
       for (var i = 0; i < count; ++i) {
           mat4.scalar.translate(out, m, v);
       }
       return performance.now() - start;
   },
   simdFunc: function(count, matrices){
       var out = new Float32Array(16);
       var v = new Float32Array(3);
       v[0] = Math.random(); v[1] = Math.random(); v[2] = Math.random();
       var m = matrices[0];
       var start = performance.now();
       for (var i = 0; i < count; ++i) {
           mat4.SIMD.translate(out, m, v);
       }
       return performance.now() - start;
  }
},
{ name : 'Multiply',
  scalarFunc: function(count, matrices) {
      var out = new Float32Array(16);
      var a = matrices[0];
      var b = matrices[1];
      start = performance.now();
      for (var i = 0; i < count; ++i) {
          mat4.scalar.multiply(out, a, b);
      }
      return performance.now() - start;
  },
  simdFunc: function(count, matrices){
      var out = new Float32Array(16);
      var a = matrices[0];
      var b = matrices[1];
      start = performance.now();
      for (var i = 0; i < count; ++i) {
          mat4.SIMD.multiply(out, a, b);
      }
      return performance.now() - start;
 }
}];

function runTest(name, f) {

  var totalTime = 0;
  var minTime = +Infinity;
  var maxTime = -Infinity;

  var times = [];
  for(var i = 0; i < config.runCount; ++i) {
    var time = f(config.internalRunCount, config.matrices);
    minTime = Math.min(minTime, time);
    maxTime = Math.max(maxTime, time);
    totalTime += time;
    times[i] = time;
  }

  var avgTime = totalTime / config.runCount;
  return {min:minTime, max:maxTime, avg:avgTime, times:times};
}

function runTests(kernels) {

    config.matrices[0] = mat4.random();
    config.matrices[1] = mat4.random();

    for(var i = 0; i < kernels.length; ++i){
        var scalarTime = runTest(kernels[i].name + "(Scalar)", kernels[i].scalarFunc);
        var simdTime = runTest(kernels[i].name + "(SIMD)", kernels[i].simdFunc);
        console.log(kernels[i].name, "scalar (min,avg,max): ", scalarTime.min, scalarTime.avg, scalarTime.max);
        console.log(kernels[i].name, "SIMD (min,avg,max): ", simdTime.min, simdTime.avg, simdTime.max);
        console.log(kernels[i].name, "avg speedup: ", scalarTime.avg/simdTime.avg);
    }
}
