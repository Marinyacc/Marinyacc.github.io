(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");
    if (!input) {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") || "";
    input.value = keyword;
    if (keyword.trim()) {
      search(keyword);
    }
    input.addEventListener("keyup", () => {
      search(input.value);
    });
  });
  function search(query) {
    const result = searchData(query);
    const html = createHtml(result);
    showResult(html);
    showResultCount(result.length, data.length);
  }
  function searchData(query) {
    const result = [];
    query = query.trim();
    if (query.length < 1) {
      return result;
    }
    const re = new RegExp(query, "i");
    for (let i = 0; i < data.length; ++i) {
      const pos = data[i].body.search(re);
      if (pos !== -1) {
        result.push([i, pos, pos + query.length]);
      }
    }
    return result;
  }
  function createHtml(result) {
    const htmls = [];
    for (const [dataIndex, startPos, endPos] of result) {
      const { url, title, body } = data[dataIndex];
      htmls.push(createEntry(url, title, body, startPos, endPos));
    }
    return htmls.join("");
  }
  function createEntry(url, title, body, startPos, endPos) {
    const template = document.getElementById("searchItemTemplate");
    if (!template) {
      throw new Error('Template element with id "searchItemTemplate" not found.');
    }
    const clone = template.content.cloneNode(true);
    const link = clone.querySelector(".search__item--title");
    if (link) {
      link.href = url;
      link.textContent = title;
    }
    const excerptEl = clone.querySelector(".search__item--excerpt");
    if (excerptEl) {
      excerptEl.innerHTML = excerpt(body, startPos, endPos);
    }
    const wrapper = document.createElement("div");
    wrapper.appendChild(clone);
    return wrapper.innerHTML;
  }
  function excerpt(body, startPos, endPos) {
    const start = Math.max(startPos - 30, 0);
    return [
      body.substring(start, startPos),
      "<b>",
      body.substring(startPos, endPos),
      "</b>",
      body.substring(endPos, endPos + 200)
    ].join("");
  }
  function showResult(html) {
    const el = document.getElementById("searchResult");
    if (el) {
      el.innerHTML = html;
    }
  }
  function showResultCount(count, total) {
    const el = document.getElementById("searchResultCount");
    if (el) {
      el.innerHTML = `<b>${count}</b> result(s) found (out of ${total})`;
    }
  }
})();
