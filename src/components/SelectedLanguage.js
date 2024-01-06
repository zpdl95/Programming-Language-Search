const MAX_DISPLAY_COUNT = 5;

class SelectedLanguage {
  /**
   *
   * @param {{$target:HTMLElement, initialState:[]}} param0
   */
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = initialState;
    this.selectedLanguageDiv = document.createElement('div');
    this.selectedLanguageDiv.setAttribute('class', 'SelectedLanguage');
    this.$target.appendChild(this.selectedLanguageDiv);

    this.render();
  }

  /**
   * SelectedLanguage클래스의 상태값 변경 함수
   * @param {[]} nextState
   */
  setState = (nextState) => {
    this.state = nextState;

    if (this.state.length > MAX_DISPLAY_COUNT) {
      const startPosition = this.state.length - MAX_DISPLAY_COUNT;
      this.state = this.state.slice(startPosition);
    }
    this.render();
  };

  render() {
    this.selectedLanguageDiv.innerHTML = `
    <ul>
        ${this.state
          .map(
            (item) => `
            <li>${item}</li>
        `
          )
          .join('')}
    </ul>
    `;
  }
}

export default SelectedLanguage;
