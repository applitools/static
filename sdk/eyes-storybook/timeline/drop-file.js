const el = document.getElementById('drop-file');

el.addEventListener('dragenter', e => {
  console.log('dragenter', e.dataTransfer.types);
  e.target.style.border = '1px dashed red';
  e.preventDefault();
});

el.addEventListener('dragover', e => {
  e.preventDefault();
});

el.addEventListener('dragleave', e => {
  console.log('dragleave', e.dataTransfer.types);
  e.target.style.border = '1px solid black';
  e.preventDefault();
});

el.addEventListener('drop', e => {
  console.log('drop types', e.dataTransfer.types);
  console.log('drop data', e.dataTransfer.files[0]);
  e.target.style.border = '1px solid black';
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    console.log('finised reading', reader);
    el.textContent = 'read ' + file.size + ' bytes ' + (file.size - reader.result.length);
    const {timing, lines} = window.convertTimeline(reader.result);
    renderTimeline(timing);
  };
  reader.readAsText(file);
  e.preventDefault();
});
