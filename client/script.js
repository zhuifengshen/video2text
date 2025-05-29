document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = e.target.elements.file.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result.split(',')[1];
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, data: base64 })
    });
    const data = await res.json();
    document.getElementById('uploadResult').textContent = data.text || data.error;
  };
  reader.readAsDataURL(file);
});

document.getElementById('linkForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = e.target.elements.url.value;
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  const data = await res.json();
  document.getElementById('linkResult').textContent = data.text || data.error;
});
