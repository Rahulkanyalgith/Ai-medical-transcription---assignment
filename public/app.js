document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('audioFile');
    const file = fileInput.files[0];
    if (!file) return;

    // UI Elements
    const submitBtn = document.getElementById('submitBtn');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const errorBox = document.getElementById('error');
    const transcriptText = document.getElementById('transcriptText');
    const conditionsList = document.getElementById('conditionsList');

    // Reset UI state
    submitBtn.disabled = true;
    loading.classList.remove('hidden');
    results.classList.add('hidden');
    errorBox.classList.add('hidden');

    const formData = new FormData();
    formData.append('audio', file);

    try {
        const response = await fetch('/transcribe', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMsg = data.error || 'Transcription failed';
            if (data.details) errorMsg += `: ${data.details}`;
            throw new Error(errorMsg);
        }

        // Show Results
        transcriptText.textContent = data.transcript || 'No text detected.';
        
        conditionsList.innerHTML = '';
        if (data.conditions && data.conditions.length > 0) {
            data.conditions.forEach(cond => {
                const li = document.createElement('li');
                li.textContent = cond;
                conditionsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'None detected';
            li.style.background = '#e2e8f0';
            li.style.color = '#64748b';
            conditionsList.appendChild(li);
        }

        results.classList.remove('hidden');

    } catch (err) {
        errorBox.textContent = err.message;
        errorBox.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        loading.classList.add('hidden');
    }
});