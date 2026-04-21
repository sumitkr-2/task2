async function loadAudio() {
  const status = document.createElement('p');
  document.body.appendChild(status);

  try {
    // Fetch metadata first
    const metaRes = await fetch('http://localhost:4000/files');
    const meta = await metaRes.json();
    const lossPercent = meta.originalSize ? ((meta.originalSize - meta.compressedSize) / meta.originalSize * 100).toFixed(1) : 0;
    status.innerText = `Latest: ${meta.name} | Original: ${meta.originalSize} bytes | Compressed: ${meta.compressedSize} bytes | Loss: ${lossPercent}%`;


    // Then audio
    const audio = document.getElementById('player');
    audio.src = 'http://localhost:4000/audio';
    audio.load();
    status.innerText += ' | Loaded - play to test';
  } catch (err) {
    status.innerText = 'Error: ' + err.message;
  }
}
