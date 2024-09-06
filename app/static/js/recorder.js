document.addEventListener("DOMContentLoaded", () => {
    let mediaRecorder;
    let audioChunks = [];
    let isRecording = false;
    const recordButton = document.getElementById("record");
    const togglePauseResumeButton = document.getElementById("pause-resume");
    const stopButton = document.getElementById("stop");
    const audioElement = document.getElementById("audio");
    const recordResultDiv = document.getElementById("record-result");
    const uploadButton = document.getElementById("upload-button");
    const audioFileInput = document.getElementById("audio-file");
    const recordingStatus = document.getElementById("recordingStatus");
    const uploadResultDiv = document.getElementById("upload-result");
    const uploadedAudioElement = document.getElementById("audio2");

    recordButton.addEventListener("click", async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            audioChunks = []; // Clear previous audio chunks
            isRecording = true;
	    recordButton.style.visibility = 'hidden';
	    togglePauseResumeButton.style.visibility = 'visible';
            stopButton.style.visibility = 'visible';
            togglePauseResumeButton.textContent = 'Pause';
            recordingStatus.textContent = 'Recording...';
            recordResultDiv.textContent = '';

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioElement.src = audioUrl;

                const formData = new FormData();
                formData.append('audioFile', audioBlob, 'recording.wav');

                try {
                    const response = await fetch('/process-audio', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    recordingStatus.textContent = '';
                    recordResultDiv.textContent = result.text;
		    togglePauseResumeButton.style.visibility = 'hidden';
	            stopButton.style.visibility = 'hidden';
               	    recordButton.style.visibility = 'visible';
                } catch (error) {
                    recordResultDiv.textContent = 'Upload failed.';
                }
            };
        } catch (error) {
            recordResultDiv.textContent = 'Recording failed.';
        }
    });

    togglePauseResumeButton.addEventListener("click", () => {
        if (mediaRecorder) {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.pause();
                togglePauseResumeButton.textContent = 'Resume';
                recordingStatus.textContent = 'Paused';
            } else if (mediaRecorder.state === 'paused') {
                mediaRecorder.resume();
                togglePauseResumeButton.textContent = 'Pause';
                recordingStatus.textContent = 'Recording...';
            }
        }
    });

    stopButton.addEventListener("click", () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            isRecording = false;
            document.getElementById('recordingStatus').textContent = 'Stopped Recording';
        }
    });

    uploadButton.addEventListener("click", async () => {
	const file = audioFileInput.files[0];
        if (!file) {
            uploadResultDiv.textContent = 'Please select a file.';
            return;
        }

        // Display "Converting..." message
        uploadResultDiv.textContent = 'Converting...';

        const formData = new FormData();
        formData.append('audioFile', file);

        try {
            const response = await fetch('/process-file', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const result = await response.json();
                uploadResultDiv.textContent = result.text;

                // Debug: Check if the result contains an audio URL
                console.log('Server response:', result);

                // If the server provides a URL for the uploaded audio, use it
                let audioUrl;
                if (result.audioUrl) {
                    audioUrl = result.audioUrl;
                } else {
                    // Create a URL for the uploaded file directly
                    audioUrl = URL.createObjectURL(file);
                }

                // Set the audio URL and make the audio player visible
                uploadedAudioElement.src = audioUrl;
                uploadedAudioElement.style.display = 'block';
            } else {
                uploadResultDiv.textContent = `Error: ${response.status}`;
            }
        } catch (error) {
            uploadResultDiv.textContent = 'Upload failed.';
        }
    });
});
