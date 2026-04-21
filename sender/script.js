async function upload() {
  const fileInput = document.getElementById("file");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("audio", file);

  const res = await fetch("http://localhost:4000/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  document.getElementById("status").innerText =
    `Original: ${data.originalSize} bytes | Compressed: ${data.compressedSize} bytes`;
}

