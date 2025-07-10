class Stopwatch {
    constructor() {
        this.time = 0;
        this.interval = null;
        this.isRunning = false;
        this.laps = [];
        this.lastLapTime = 0;

        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.clearLapsBtn = document.getElementById('clearLapsBtn');
        this.lapTimes = document.getElementById('lapTimes');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.statsSection = document.getElementById('statsSection');
        this.totalLaps = document.getElementById('totalLaps');
        this.bestLap = document.getElementById('bestLap');
        this.avgLap = document.getElementById('avgLap');

       
        this.startBtn.onclick = () => this.start();
        this.pauseBtn.onclick = () => this.pause();
        this.lapBtn.onclick = () => this.lap();
        this.resetBtn.onclick = () => this.reset();
        this.clearLapsBtn.onclick = () => this.clearLaps();

       
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') { e.preventDefault(); this.isRunning ? this.pause() : this.start(); }
            else if (e.code === 'KeyL' && this.isRunning) { this.lap(); }
            else if (e.code === 'KeyR') { this.reset(); }
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.interval = setInterval(() => {
                this.time += 10;
                this.updateDisplay();
            }, 10);
            this.updateButtons();
            this.updateStatus('running');
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
            this.updateButtons();
            this.updateStatus('paused');
        }
    }

    reset() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.time = 0;
        this.lastLapTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapDisplay();
        this.updateStats();
        this.updateButtons();
        this.updateStatus('stopped');
    }

    lap() {
        const lapTime = this.time - this.lastLapTime;
        this.laps.push({ number: this.laps.length + 1, totalTime: this.time, lapTime });
        this.lastLapTime = this.time;
        this.updateLapDisplay();
        this.updateStats();
    }

    clearLaps() {
        this.laps = [];
        this.lastLapTime = 0;
        this.updateLapDisplay();
        this.updateStats();
    }

    formatTime(ms) {
        const min = String(Math.floor(ms / 60000)).padStart(2, '0');
        const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
        return `${min}:${sec}.${cs}`;
    }

    updateDisplay() {
        this.timeDisplay.textContent = this.formatTime(this.time);
    }

    updateButtons() {
        this.startBtn.disabled = this.isRunning;
        this.pauseBtn.disabled = !this.isRunning;
        this.lapBtn.disabled = !this.isRunning;
        this.startBtn.textContent = this.isRunning ? 'Running' : (this.time > 0 ? 'Resume' : 'Start');
    }

    updateStatus(state) {
        this.statusIndicator.className = `status-indicator ${state}`;
    }

    updateLapDisplay() {
        if (!this.laps.length) {
            this.lapTimes.innerHTML = '<div style="text-align:center; color:#999; padding:10px;">No lap times yet</div>';
            this.clearLapsBtn.style.display = 'none';
            this.statsSection.style.display = 'none';
            return;
        }

        this.clearLapsBtn.style.display = 'block';
        this.statsSection.style.display = 'flex';
        this.lapTimes.innerHTML = this.laps.slice().reverse().map(lap => `
            <div class="lap-item">
                <span class="lap-number">Lap ${lap.number}</span>
                <span class="lap-time">${this.formatTime(lap.totalTime)}</span>
                <span class="lap-split">(+${this.formatTime(lap.lapTime)})</span>
            </div>
        `).join('');
    }

    updateStats() {
        if (!this.laps.length) {
            this.totalLaps.textContent = '0';
            this.bestLap.textContent = '--:--.--';
            this.avgLap.textContent = '--:--.--';
            return;
        }
        const best = Math.min(...this.laps.map(l => l.lapTime));
        const avg = this.laps.reduce((sum, l) => sum + l.lapTime, 0) / this.laps.length;
        this.totalLaps.textContent = this.laps.length;
        this.bestLap.textContent = this.formatTime(best);
        this.avgLap.textContent = this.formatTime(avg);
    }
}

document.addEventListener('DOMContentLoaded', () => new Stopwatch());
