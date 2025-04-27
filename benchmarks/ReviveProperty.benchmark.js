const Benchmark = require('benchmark');
const BoolProperty = require("../src/converter/properties/BoolProperty");

function benchmarkRevivePropertySetPrototypeOf() {
    const someBoolProperty = {"type": "BoolProperty", "name": "someBoolProperty", "value": true};
    Object.setPrototypeOf(someBoolProperty, BoolProperty.prototype);
    return someBoolProperty;
}

function benchmarkRevivePropertyCreateAssign() {
    const someBoolProperty = {"type": "BoolProperty", "name": "someBoolProperty", "value": true};
    const instance = Object.create(BoolProperty.prototype);
    Object.assign(instance, someBoolProperty);
    return instance;
}

const suite = new Benchmark.Suite("performance");

suite
    .add('setPrototypeOf', benchmarkRevivePropertySetPrototypeOf)
    .add('create + assign', benchmarkRevivePropertyCreateAssign)
    .on('cycle', function (event) {
        const benchmark = event.target;
        console.log(`Benchmark: ${benchmark.name}`);
        console.log(`Operations per second (Hz): ${benchmark.hz.toFixed(2)} ops/sec`);
        console.log(`Relative Margin of Error (RME): ${benchmark.stats.rme.toFixed(2)}%`);
        console.log(`Sample Size: ${benchmark.stats.sample.length} iterations`);
        console.log(`Total Executions: ${benchmark.count} times`);
        console.log(`Total Cycles: ${benchmark.cycles} cycles\n`);
    })
    .on('complete', function () {
        const fastestBenchmark = this.filter('fastest')[0];
        const slowestBenchmark = this.filter('slowest')[0];
        const slowestHz = slowestBenchmark.hz;

        console.log('\nBenchmark Summary:');
        this.forEach(bench => {
            const speedDifference = ((bench.hz / slowestHz) * 100).toFixed(2);
            console.log(`${bench.name.padEnd(20)}: ${bench.hz.toFixed(2).padStart(12)} ops/sec (${speedDifference}% of slowest)`);
        });

        console.log(`\nFastest Benchmark: ${fastestBenchmark.name}`);
    })
    .run();
