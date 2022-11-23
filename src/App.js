import { request } from "./api.js";
import Header from "./Header.js";
import SearchResult from "./SearchResult.js";
import SuggestKeywords from "./SuggestKeywords.js";

export default function App({ $target }) {
  this.state = {
    keyword: '',
    keywords: [],
    catImages: []
  }

  this.setState = (nextState) => {
    this.state = nextState;

    if(this.state.keyword !== nextState.keyword) {
      header.setState({
        keyword: this.state.keyword
      })
    }
    suggestKeywords.setState({
      keywords: this.state.keywords
    });

    if(this.state.catImages.length > 0) {
      searchResults.setState(this.state.catImages);
    }
  }

  const header = new Header({ 
    $target,
    initialState: {
      keyword: this.state.keyword
    },
    onKeywordInput: async (keyword) => {
      if(keyword.trim().length > 1) {
        const keywords = await request(`/keywords?q=${keyword}`);

        this.setState({
          ...this.state,
          keyword,
          keywords,
        })
      }
    },
    onEnter: () => {
      fetchCatsImage();
    }
  });

  const suggestKeywords = new SuggestKeywords({
    $target,
    initialState: {
      keywords: this.state.keywords,
      cursor: -1
    },
    onKeywordSelect: (keyword) => {
      this.setState({
        ...this.state,
        keyword,
        keywords: []
      })
      fetchCatsImage()
    }
  })

  const searchResults = new SearchResult({
    $target,
    initialState: this.state.catImages
  })

  const fetchCatsImage = async () => {
    const { data } = await request(`/search?q=${this.state.keyword}`);
    
    this.setState({
      ...this.state,
      catImages: data
    })
  }
}
