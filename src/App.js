import { request } from "./api.js";
import debounce from "./debounce.js";
import Header from "./Header.js";
import SearchResult from "./SearchResult.js";
import session from "./storage.js";
import SuggestKeywords from "./SuggestKeywords.js";

export default function App({ $target }) {
  this.state = {
    keyword: "",
    keywords: [],
    catImages: [],
  };

  const KEYWORD_SESSION_KEY = "keyword_cache";

  this.cached = session.getItem(KEYWORD_SESSION_KEY, {});


  this.setState = (nextState) => {
    if (this.state.keyword !== nextState.keyword) {
      header.setState({
        keyword: nextState.keyword,
      });
    }

    this.state = nextState;

    suggestKeywords.setState({
      keywords: this.state.keywords,
    });

    if (this.state.catImages.length > 0) {
      searchResults.setState(this.state.catImages);
    }
  };

  const header = new Header({
    $target,
    initialState: {
      keyword: this.state.keyword,
    },
    onKeywordInput: debounce(async (keyword) => {
      if (keyword.trim().length > 1) {
        console.log(this.cached, this.cached[keyword])
        const keywords =
          this.cached[keyword] ?? await request(`/keywords?q=${keyword}`);

        if (!this.cached[keyword]) {
          this.cached[keyword] = keywords;
          session.setItem(KEYWORD_SESSION_KEY, this.cached);
        }

        this.setState({
          ...this.state,
          keyword,
          keywords,
        });
      }
    }, 300),
    onEnter: () => {
      fetchCatsImage();
    },
  });

  const suggestKeywords = new SuggestKeywords({
    $target,
    initialState: {
      keywords: this.state.keywords,
      cursor: -1,
    },
    onKeywordSelect: (keyword) => {
      this.setState({
        ...this.state,
        keyword,
        keywords: [],
      });
      fetchCatsImage();
    },
  });

  const searchResults = new SearchResult({
    $target,
    initialState: this.state.catImages,
  });

  const fetchCatsImage = async () => {
    const { data } = await request(`/search?q=${this.state.keyword}`);

    this.setState({
      ...this.state,
      catImages: data,
    });
  };
}
