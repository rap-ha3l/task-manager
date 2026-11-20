const $ = s => document.querySelector(s);
let tasks = load(), filter = 'all';

function load() { try { return JSON.parse(localStorage.getItem('tasks')) || []; } catch { return []; } }
function save() { try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch {} }
function btn(label, cls) { const b = document.createElement('button'); b.textContent = label; b.className = cls; return b; }

function render() {
  const list = $('#list');
  list.innerHTML = '';
  const shown = tasks.filter(t => filter === 'all' || (filter === 'done') === t.done);
  shown.forEach(t => {
    const li = document.createElement('li');
    li.dataset.id = t.id;
    li.classList.toggle('done', t.done);
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.checked = t.done; cb.className = 'toggle';
    cb.setAttribute('aria-label', 'Mark done');
    const span = document.createElement('span');
    span.textContent = t.text;
    li.append(cb, span, btn('Edit', 'edit'), btn('Delete', 'del'));
    list.append(li);
  });
  $('#empty').hidden = shown.length > 0;
  $('#count').textContent = tasks.filter(t => !t.done).length + ' left';
  document.querySelectorAll('.filters button').forEach(b => b.classList.toggle('active', b.dataset.f === filter));
}

$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const text = $('#text').value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, done: false });
  $('#text').value = '';
  save(); render();
});

$('#list').addEventListener('change', e => {
  if (!e.target.classList.contains('toggle')) return;
  const t = tasks.find(t => t.id == e.target.closest('li').dataset.id);
  t.done = e.target.checked;
  save(); render();
});

$('#list').addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const t = tasks.find(t => t.id == li.dataset.id);
  if (e.target.classList.contains('del')) tasks = tasks.filter(x => x !== t);
  else if (e.target.classList.contains('edit')) {
    const text = prompt('Edit task', t.text);
    if (text && text.trim()) t.text = text.trim();
  } else return;
  save(); render();
});

document.querySelector('.filters').addEventListener('click', e => {
  if (e.target.dataset.f) { filter = e.target.dataset.f; render(); }
});
$('#clear').addEventListener('click', () => { tasks = tasks.filter(t => !t.done); save(); render(); });
render();
