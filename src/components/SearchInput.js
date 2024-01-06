class SearchInput {
  /**
   * @constructor
   * @param {{$target: HTMLElement, initialState:string, onChange:(string)=>void}} param0
   */
  constructor({ $target, initialState, onChange }) {
    this.$target = $target;
    this.state = initialState;
    this.onChange = onChange;

    this.render();
  }

  render() {
    const $form = document.createElement('form');
    $form.setAttribute('class', 'SearchInput');
    this.$target.appendChild($form);

    const $input = document.createElement('input');
    $input.setAttribute('class', 'SearchInput__input');
    $input.setAttribute('type', 'text');
    $input.setAttribute('placeholder', '프로그램 언어를 입력하세요.');
    $input.setAttribute('value', `${this.state}`);
    $form.appendChild($input);
    $input.focus();

    $form.addEventListener('keyup', (e) => {
      const actionIgnoreKeys = [
        'Enter',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
      ];
      if (!actionIgnoreKeys.includes(e.key)) this.onChange(e.target.value);
    });
    $form.addEventListener('submit', (e) => e.preventDefault());
  }
}

export default SearchInput;
