document.addEventListener('DOMContentLoaded', () => {
    const youtubeUrlInput = document.getElementById('youtube-url');
    const outputDirInput = document.getElementById('output-dir');
    const formatSelect = document.getElementById('format');
    const convertBtn = document.getElementById('convert-btn');
    const statusMessage = document.getElementById('status-message');
    const progressBar = document.getElementById('progress');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    function validateYoutubeUrl(url) {
        const regex = /(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})/;
        return regex.test(url);
    }

    function updateStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.className = isError ? 'error' : 'success';
    }

    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
    }

    function resetUI() {
        updateProgress(0);
        convertBtn.disabled = false;
    }

    function simulateConversion() {
        const url = youtubeUrlInput.value.trim();
        const outputDir = outputDirInput.value.trim();
        const format = formatSelect.value;

        if (!validateYoutubeUrl(url)) {
            updateStatus('Please enter a valid YouTube URL', true);
            return;
        }

        convertBtn.disabled = true;
        updateStatus('Starting conversion...');
        updateProgress(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            updateProgress(progress);
            
            if (progress < 30) {
                updateStatus('Downloading audio...');
            } else if (progress < 60) {
                updateStatus(`Converting to ${format.toUpperCase()}...`);
            } else if (progress < 90) {
                updateStatus('Processing...');
            }

            if (progress >= 100) {
                clearInterval(interval);
                const downloadLocation = outputDir || 'downloads folder';
                updateStatus(`Conversion completed successfully! ${format.toUpperCase()} file saved to ${downloadLocation}`);
                setTimeout(resetUI, 3000);
            }
        }, 200);
    }

    function toggleDarkMode() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function applySavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }

    convertBtn.addEventListener('click', simulateConversion);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    youtubeUrlInput.addEventListener('input', () => {
        if (youtubeUrlInput.value.trim() === '') {
            updateStatus('');
            updateProgress(0);
        }
    });

    // Update output directory placeholder to show default
    outputDirInput.placeholder = "Leave empty to use downloads folder";

    // Apply saved theme on page load
    applySavedTheme();
});
