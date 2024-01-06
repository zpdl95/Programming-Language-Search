class Suggestion {
  /**
   * @constructor
   * @param {{$target:HTMLElement,initialState:{items: []}}} param0
   */
  constructor({ $target, initialState, onSelect }) {
    this.$target = $target;
    this.state = {
      selectedIndex: initialState.selectedIndex,
      items: initialState.items,
      keyword: initialState.keyword,
    };
    this.onSelect = onSelect;

    this.$suggestion = document.createElement('div');
    this.$suggestion.setAttribute('class', 'Suggestion');
    this.$target.appendChild(this.$suggestion);

    this.render();

    // 추천 검색어 키보드로 이동&선택
    window.addEventListener('keyup', (e) => {
      if (this.state.items.length > 0) {
        const { selectedIndex } = this.state;
        const lastIndex = this.state.items.length - 1;

        const navigationKeys = ['ArrowUp', 'ArrowDown'];
        let nextIndex = selectedIndex;

        if (navigationKeys.includes(e.key)) {
          if (e.key === 'ArrowUp')
            nextIndex = selectedIndex === 0 ? lastIndex : nextIndex - 1;
          else if (e.key === 'ArrowDown')
            nextIndex = selectedIndex === lastIndex ? 0 : nextIndex + 1;
        } else if (e.key === 'Enter') {
          this.onSelect(this.state.items[this.state.selectedIndex]);
        }

        this.setState({ ...this.state, selectedIndex: nextIndex });
      }
    });

    // 추천 검색어 마우스로 선택
    this.$suggestion.addEventListener('click', (e) => {
      // 이벤트 위임을 사용할때 요소를 찾는 좋은 방법 closest()
      const $li = e.target.closest('li');
      if ($li) {
        const { index } = $li.dataset;
        try {
          this.onSelect(this.state.items[Number(index)]);
        } catch (error) {
          alert('선택이 잘못되었습니다! 다시 선택해 주세요!');
        }
      }
    });
  }

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.render();
  };

  renderMatchedItem = (keyword, item) => {
    const matchedText = item.match(new RegExp(keyword, 'gi'))[0];
    return item.replace(
      matchedText,
      `<span class="Suggestion__item--matched">${matchedText}</span>`
    );
  };

  render() {
    const { items, selectedIndex, keyword } = this.state;
    if (items.length > 0) {
      this.$suggestion.style.display = 'block';
      this.$suggestion.innerHTML = `
      <ul>
        ${items
          .map(
            (item, idx) => `
            <li class='${
              idx === selectedIndex ? 'Suggestion__item--selected' : ''
            }' data-index='${idx}'>${this.renderMatchedItem(keyword, item)}</li>
        `
          )
          .join('')}
        </ul>
      `;
    } else {
      this.$suggestion.style.display = 'none';
      this.$suggestion.innerHTML = '';
    }
  }
}

export default Suggestion;
