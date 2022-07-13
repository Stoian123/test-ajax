$(document).ready(function () {
  function JSClock(value) {
    var time = new Date(value);
    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();
    var temp = '' + (hour > 12 ? hour - 12 : hour);
    if (hour == 0) temp = '12';
    temp += (minute < 10 ? ':0' : ':') + minute;
    temp += (second < 10 ? ':0' : ':') + second;
    temp += hour >= 12 ? ' P.M.' : ' A.M.';
    return temp;
  }
  const collator = new Intl.Collator('en');
  function sortName(a, b) {
    return collator.compare(a.name, b.name);
  }
  function sortSize(a, b) {
    return collator.compare(a.size, b.size);
  }
  function sortTime(a, b) {
    return collator.compare(a.atime, b.atime);
  }
  function skelet(item) {
    app.innerHTML += `
      <ul class="app-list">
        <li class="app-column app-name">
          <span class="app-label">Name</span>
          <a class="app-link">${item.name}</a>
        </li>
        <li class="app-column app-date">
          <span class="app-label">ATime</span>
          <a class="app-link">${JSClock(item.atime)}</a>
        </li>
        <li class="app-column app-date">
          <span class="app-label">MTime</span>
          <a class="app-link">${JSClock(item.mtime)}</a>
        </li>
        <li class="app-column app-type">
          <span class="app-label">Type</span>
          <a class="app-link">${item.type}</a>
        </li>
        <li class="app-column app-size">
          <span class="app-label">Size</span>
          <a class="app-link">${item.size}</a>
        </li>
      </ul>
    `;
  }
  const app = document.getElementById('app');
  const nameBtn = document.getElementById('nameBtn');
  const sizeBtn = document.getElementById('sizeBtn');
  const timeBtn = document.getElementById('sortTime');
  let cookieValue = document.cookie;
  console.log(cookieValue);
  let myData;
  const data = [];
  $.ajax({
    url: 'https://prof.world/api/test_json_files/?token=6a06cc0050374e32be51125978904bd8',
    type: 'GET',
    dataType: 'json',
    success: (responce) => {
      myData = responce.data.files;
    },
  }).then(() => {
    for (let key in myData) {
      myData[key].forEach((element) => {
        data.push(element);
      });
    }
    if (cookieValue.includes('byName')) {
      data.sort(sortName).map((item) => {
        skelet(item);
      });
    } else if (cookieValue.includes('bySize')) {
      data.sort(sortSize).map((item) => {
        skelet(item);
      });
    } else if (cookieValue.includes('byTime')) {
      data.sort(sortTime).map((item) => {
        skelet(item);
      });
    } else {
      data.map((item) => {
        skelet(item);
      });
    }
  });
  nameBtn.addEventListener('click', () => {
    document.cookie = 'sort=byName';
    app.innerHTML = '';
    data.sort(sortName).map((item) => skelet(item));
  });
  sizeBtn.addEventListener('click', () => {
    document.cookie = 'sort=bySize';
    app.innerHTML = '';
    data.sort(sortSize).map((item) => skelet(item));
  });
  timeBtn.addEventListener('click', () => {
    document.cookie = 'sort=byTime';
    app.innerHTML = '';
    data.sort(sortTime).map((item) => skelet(item));
  });
});
