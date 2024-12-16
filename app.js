class BloodPressureApp {
    constructor() {
        this.readings = JSON.parse(localStorage.getItem('bpReadings')) || [];
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.form = document.getElementById('bp-form');
        this.systolicInput = document.getElementById('systolic');
        this.diastolicInput = document.getElementById('diastolic');
        this.dateInput = document.getElementById('reading-date');
        this.exportButton = document.getElementById('export-csv');
        this.startDate = document.getElementById('start-date');
        this.endDate = document.getElementById('end-date');
        this.cancelButton = document.getElementById('cancel-btn');
        
        // Set default date-time to current
        const now = new Date().toISOString().slice(0, 16);
        this.dateInput.value = now;
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.exportButton.addEventListener('click', () => this.exportToCSV());
        this.cancelButton.addEventListener('click', () => this.handleCancel());
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const reading = {
            systolic: parseInt(this.systolicInput.value),
            diastolic: parseInt(this.diastolicInput.value),
            date: new Date(this.dateInput.value).toISOString()
        };

        this.readings.push(reading);
        localStorage.setItem('bpReadings', JSON.stringify(this.readings));
        
        this.form.reset();
        
        // Set default date-time to current
        const now = new Date().toISOString().slice(0, 16);
        this.dateInput.value = now;
    }

    handleCancel() {
        this.form.reset();
        const now = new Date().toISOString().slice(0, 16);
        this.dateInput.value = now;
    }

    exportToCSV() {
        let filteredReadings = this.readings;
        
        if (this.startDate.value && this.endDate.value) {
            const start = new Date(this.startDate.value);
            const end = new Date(this.endDate.value);
            filteredReadings = this.readings.filter(reading => {
                const date = new Date(reading.date);
                return date >= start && date <= end;
            });
        }

        const csvContent = [
            ['Date', 'Time', 'Systolic', 'Diastolic'],
            ...filteredReadings.map(reading => {
                const date = new Date(reading.date);
                return [
                    date.toLocaleDateString(),
                    date.toLocaleTimeString(),
                    reading.systolic,
                    reading.diastolic
                ];
            })
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'blood-pressure-history.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new BloodPressureApp();
});
