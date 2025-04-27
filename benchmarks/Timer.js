const {performance} = require('perf_hooks');

class Timer {
    constructor() {
        this.start = performance.now();
        this.steps = [];
        this.longestLabel = 0;
        this.maxDurationLength = 0;
    }

    mark(label) {
        const now = performance.now();
        const lastTime = this.steps.at(-1)?.time ?? this.start;
        const duration = now - lastTime;

        this.steps.push({label, time: now, duration});
        this.longestLabel = Math.max(this.longestLabel, label.length);
        this.maxDurationLength = Math.max(this.maxDurationLength, duration.toFixed(2).length);

        this.#printStep(label, duration);
    }

    report() {
        if (this.steps.length === 0) return;

        const total = this.steps.at(-1).time - this.start;

        console.log('\n' + '-'.repeat(50));
        console.log('Final Report:');
        console.log('-'.repeat(50));

        this.steps.forEach(step => {
            this.#printStep(step.label, step.duration, step.duration / total * 100);
        });

        this.#printStep('Total', total);
    }

    #printStep(label, duration, percentage = null) {
        const paddedLabel = label.padEnd(this.longestLabel, ' ');
        const paddedDuration = duration.toFixed(2).padStart(this.maxDurationLength, ' ');
        const percentageStr = percentage !== null ? ` (${percentage.toFixed(1).padStart(5, ' ')}%)` : '';
        console.log(`${paddedLabel} : ${paddedDuration} ms${percentageStr}`);
    }
}

module.exports = Timer;
