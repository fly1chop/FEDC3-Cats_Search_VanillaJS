export default function SuggestKeywords({
  $target,
  initialState,
  onKeywordSelect,
}) {
  const $suggest = document.createElement("div");
  $suggest.className = "Keywords";
  $target.appendChild($suggest);

  this.state = initialState;

  this.setState = (nextState) => {
    this.state = { ...this.state, ...nextState };
    this.render();
  };

  this.render = () => {
    const { keywords, cursor } = this.state;
    $suggest.innerHTML = `
      <ul>
        ${keywords
          .map(
            (keyword, i) => `
          <li class="${cursor === i ? "active" : ""}">${keyword}</li>
        `
          )
          .join("")}
      </ul>
    `;

    $suggest.style.display = this.state.keywords.length > 0 ? "block" : "none";
  };

  this.render();

  $suggest.addEventListener("click", (e) => {
    const $li = e.target.closest("li");

    if (!$li) return;

    onKeywordSelect($li.textContent);
  });

  window.addEventListener("keydown", (e) => {
    if ($suggest.style.display === "none") return;

    switch (e.key) {
      case "ArrowUp": {
        const nextCursor = this.state.cursor - 1;
        this.setState({
          ...this.state,
          cursor: nextCursor < 0 ? this.state.keywords.length - 1 : nextCursor,
        });
        break;
      }
      case "ArrowDown": {
        const nextCursor = this.state.cursor + 1;
        this.setState({
          ...this.state,
          cursor: nextCursor > this.state.keywords.length - 1 ? 0 : nextCursor,
        });
        break;
      }
      case "Enter":
        if(this.state.cursor < 0) return;
        onKeywordSelect(this.state.keywords[this.state.cursor])
        break;
    }
  });
}
