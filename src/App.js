import SearchInput from './components/SearchInput';
import { fetchLanguages } from './api/api';
import Suggestion from './components/Suggestion';
import SelectedLanguage from './components/SelectedLanguage';

class App {
  /**
   * @constructor
   * @param {{$target:HTMLElement}} param0
   */
  constructor({ $target }) {
    this.$target = $target;
    this.state = {
      fetchedLanguages: [],
      selectedLanguages: [],
      keyword: '',
    };
    this.suggestion = null;
    this.selectedLanguges = null;

    this.render();
  }

  /**
   * 디바운스 함수
   * @param {Function} func
   * @param {number} delay
   * @returns
   */
  debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  /** @param {{fetchLanguages:[], selectedLanguages:[]}} nextState */
  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.suggestion.setState({
      selectedIndex: 0,
      items: this.state.fetchedLanguages,
      keyword: this.state.keyword,
    });
    this.selectedLanguges.setState(this.state.selectedLanguages);
  };

  render() {
    // App이 다른 모든 컴포넌트 최상위에 존재

    this.selectedLanguges = new SelectedLanguage({
      $target: this.$target,
      initialState: [],
    });

    const searchInput = new SearchInput({
      $target: this.$target,
      initialState: '',
      // App에서 작성한 함수를 input클래스로 넘긴다
      onChange: this.debounce(async (keyword) => {
        if (keyword.trim().length === 0) {
          this.setState({ fetchedLanguages: [] });
        } else {
          const languages = await fetchLanguages(keyword);
          this.setState({ fetchedLanguages: languages, keyword });
        }
      }),
    });

    this.suggestion = new Suggestion({
      $target: this.$target,
      initialState: { selectedIndex: 0, items: [] },
      onSelect: (language) => {
        alert(language);
        // --- 아래의 내용은 이미 존재하는 언어를 선택하면 배열 맨뒤로 옮기는것 ---
        const nextSelectedLanguages = [...this.state.selectedLanguages];
        const index = nextSelectedLanguages.findIndex(
          (selectedLanguage) => selectedLanguage === language
        );
        if (index > -1) {
          nextSelectedLanguages.splice(index, 1);
        }
        nextSelectedLanguages.push(language);

        this.setState({
          ...this.state,
          selectedLanguages: nextSelectedLanguages,
        });
      },
    });
  }
}

export default App;
