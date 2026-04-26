import Benchmark from 'benchmark';
import BoolProperty from '../src/converter/properties/BoolProperty.js';

// "Reviving" means turning a plain JSON object back into a typed class instance.
// This benchmark compares two approaches for doing that.

function setPrototypeOf() {
    const instance = {'type': 'BoolProperty', 'name': 'someBoolProperty', 'value': true};
    Object.setPrototypeOf(instance, BoolProperty.prototype);
    return instance;
}

function createAndAssign() {
    const instance = Object.create(BoolProperty.prototype);
    Object.assign(instance, {'type': 'BoolProperty', 'name': 'someBoolProperty', 'value': true});
    return instance;
}

const suite = new Benchmark.Suite('performance');

suite
    .add('setPrototypeOf', setPrototypeOf)
    .add('create + assign', createAndAssign)
    .on('cycle', function (event) {
        const b = event.target;
        const ops = Math.round(b.hz).toLocaleString('en');
        console.log(`  ${b.name.padEnd(20)} ${ops.padStart(15)} ops/sec  ±${b.stats.rme.toFixed(2)}%  (${b.stats.sample.length} samples)`);
    })
    .on('complete', function () {
        const fastest = this.filter('fastest')[0];
        const slowest = this.filter('slowest')[0];
        const ratio = (fastest.hz / slowest.hz).toFixed(2);

        console.log(`\nFastest: ${fastest.name} — ${ratio}x faster than ${slowest.name}`);
    })
    .run();
