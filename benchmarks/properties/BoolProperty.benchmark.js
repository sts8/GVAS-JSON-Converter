const Benchmark = require('benchmark');
const {BoolProperty} = require("../../src/converter/properties");

const someBoolProperty = {
    "type": "BoolProperty",
    "name": "someBoolProperty",
    "value": true
};

const someBoolPropertyBytes = new Uint8Array([
    /* 17 */                 0x11, 0x00, 0x00, 0x00,
    /* "someBoolProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
    /* 13 */                 0x0D, 0x00, 0x00, 0x00,
    /* "BoolProperty" */     0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
    /* <Padding> */          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    /* True */               0x01,
    /* <Padding> */          0x00
]);

function newToBytes() {
    const instance = Object.create(BoolProperty.prototype);
    Object.assign(instance, someBoolProperty);

    return instance.toBytes();
}

function oldToBytes() {
    const instance = Object.create(BoolProperty.prototype);
    Object.assign(instance, someBoolProperty);

    return instance.toBytesOld();
}

const suite = new Benchmark.Suite("performance");

suite
    .add('newToBytes', newToBytes)
    .add('oldToBytes', oldToBytes)
    .on('start', function () {
        if (Buffer.compare(Buffer.from(oldToBytes()), Buffer.from(someBoolPropertyBytes)) !== 0) {
            throw new Error("oldToBytes BAD!")
        }
        if (Buffer.compare(Buffer.from(newToBytes()), Buffer.from(someBoolPropertyBytes)) !== 0) {
            throw new Error("newToBytes BAD!")
        }
    })
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
