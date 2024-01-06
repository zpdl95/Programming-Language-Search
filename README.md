# [프로그래머스 과제테스트 연습] 사원 정보 테이블 구축{2022 Dev-Matching: 웹 프론트엔드 개발자(상반기)}

<ol style='border:1px solid; border-radius:10px'>
<li style='font-size:2rem'><a href='#파일구조'>파일구조</a></li>
<li style='font-size:2rem'><a href='#언어-검색'>언어 검색</a></li>
<li style='font-size:2rem'><a href='#언어-선택'>언어 선택</a></li>
<li style='font-size:2rem'><a href='#선택된-언어-렌더링'>선택된 언어 렌더링</a></li>
<li style='font-size:2rem'><a href='#사용성-개선'>사용성 개선</a></li>
<li style='font-size:2rem'><a href='#api-사용-최적화'>API 사용 최적화</a></li>
</ol>

<hr/>

## 파일구조

> 아래와 같이 파일 구조를 변경하고 진행 하겠습니다.

    src
    |  |___api
    |  |___components
    |  |___App.js
    |
    index.html
    |
    index.js
    |
    style.css

> src 폴더 안에 `App.js` 파일을 생성 후, 다음과 같이 코드를 작성합니다.

```js
// src > App.js
class App {
  constructor({ $target }) {
    this.$target = $target;
    this.state = {
      fetchedLanguages: [],
      selectedLanguages: [],
    };
  }
  setState = (nextState) => {};
}
export default App;
```

> Suggestion 요소에 들어갈 데이터인 fetchedLanguages
>
> SelectedLanguage 요소에 들어갈 데이터인 selectedLanguages
>
> 검색한 글자를 강조하기 위한 데이터인 keyword
>
> 이렇게 3가지 데이터를 state에 생성해 둡니다.

```js
// index.js
import App from './src/App';

new App({ $target: document.querySelector('.App') });
```

> `index.html`에서 `main` 엘리먼트의 클래스인 `.App` 을 타겟요소로 넘겨줍니다.

<hr/>

## 언어 검색

- 처음 화면에 접속하면 input 하나만 떠있습니다.
- 여기서 키보드를 통해 검색 키워드를 입력하면 input 아래에 입력한 검색어를 기준으로 언어 목록을 렌더링합니다. 추천 검색어는 아래 설명된 API를 통해 요청합니다.
- 화살표 위, 아래로 추천된 언어 목록을 순회할 수 있도록 합니다. 이때 제시된 샘플 코드를 기반으로 몇번째 언어를 순회 중인지 표시하도록 합니다.(`Suggestion__item--selected` class 이용)
  - 이 상태에서 엔터키를 누르는 경우, 아래 명시된 `언어 선택` 동작이 이루어지도록 합니다.
  - 화살표 키를 누를 때는 검색 동작이 일어나면 안 됩니다. 관련하여 예외처리를 적절하게 해주세요.
  - 순회 시 첫번째 요소에서 화살표 위를 누르면 맨 끝으로, 맨 끝에서 화살표 아래를 누르면 맨 처음으로 와야 합니다.
- input 내 검색어를 모두 삭제할 경우, 추천 검색어 및 추천 검색어를 띄워준 창을 보이지 않게 합니다.

> 언어 검색부분을 구현할 SearchInput 컴포넌트를 만들어 보겠습니다.

```js
// src > components > SearchInput.js
class SearchInput {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = initialState;
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
  }
}

export default SearchInput;
```

> 다음 App.js에서 호출하겠습니다.

```js
// src > App.js
import SearchInput from './components/SearchInput';

class App {
  constructor({ $target }) {
    ...
  };

  ...

  render() {
    const searchInput = new SearchInput({
      $target: this.$target,
      initialState: '',
    });
  }
}
export default App;
```

> api를 사용하기 위해 api.js파일을 만들도록 하겠습니다.

```js
// src > api > api.js
const API_END_POINT =
  'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev';

const request = async (url) => {
  const res = await fetch(url);

  if (res.ok) {
    const json = res.json();
    return json;
  }

  throw new Error('요청에 실패함');
};

export const fetchLanguages = async (keyword) =>
  request(`${API_END_POINT}/languages?keyword=${keyword}`);
```

> `SearchInput` 컴포넌트에서 입력 이벤트가 발생했을때 api를 사용해 추천 검색어를 요청해보도록 하겠습니다.

```js
// src > components > SearchInput.js
class SearchInput {
  constructor({ $target, initialState, onChange }) {
    this.$target = $target;
    this.state = initialState;
    this.onChange = onChange;
    this.render();
  }

  render() {
    ...

    $form.addEventListener('keyup', (e) => {
      this.onChange(e.target.value)
    });
  }
}
export default SearchInput;
```

```js
// src > App.js
import SearchInput from './components/SearchInput';
import { fetchLanguages } from './api/api';

class App {
  constructor({ $target }) {
    ...
  }

  ...

  render() {
    const searchInput = new SearchInput({
      $target: this.$target,
      initialState: '',
      onChange: async (keyword) => {
        const languages = await fetchLanguages(keyword);
        console.log(languages)
      },
    });
  }
}
export default App;
```

> 콘솔창에 들어가 확인해보면 입력된 언어를 기준으로 api를 통해 추천 검색어가 출력되는것을 볼 수 있습니다.

> 추천 검색어 언어 목록을 렌더링하기위해 `Suggestion` 컴포넌트를 생성하겠습니다.

```js
// src > components > Suggestion.js
class Suggestion {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = initialState;

    this.$suggestion = document.createElement('div');
    this.$suggestion.setAttribute('class', 'Suggestion');
    this.$target.appendChild(this.$suggestion);

    this.render();
  }

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.render();
  };

  render() {
    const { items } = this.state;
    if (items.length > 0) {
      this.$suggestion.style.display = 'block';
      this.$suggestion.innerHTML = `
      <ul>
        ${items
          .map((item, idx) => `<li data-index='${idx}'>${item}</li>`)
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
```

```js
// src > App.js

import SearchInput from './components/SearchInput';
import { fetchLanguages } from './api/api';
import Suggestion from './components/Suggestion';

class App {
  constructor({ $target }) {
    ...
    this.suggestion = null;
    this.render();
  }

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.suggestion.setState({
      items: this.state.fetchedLanguages,
    });
  };

  render() {
    const searchInput = new SearchInput({
      $target: this.$target,
      initialState: '',
      onChange: async (keyword) => {
        if (keyword.trim().length === 0) {
          this.setState({ fetchedLanguages: [] });
        } else {
          const languages = await fetchLanguages(keyword);
          this.setState({ fetchedLanguages: languages, keyword });
        }
      },
    });

    this.suggestion = new Suggestion({
      $target: this.$target,
      initialState: {  items: [] },
    });
  }
}
export default App;
```

> 각각의 컴포넌트에서 변경사항이 있다면 `App` 컴포넌트에 있는 setState 함수를 사용해 연결되어 있는 컴포넌트의 state값도 같이 변경시켜 동기화 합니다.
>
> `SearchInput` 에 검색을 해보시면, 언어 목록이 렌더링 되는 것을 볼 수 있습니다.
>
> `onChange` 함수에서 입력값이 없을 경우 `fetchedLanguages` 를 빈배열로 만들어 추천 언어 목록이 안보이도록 만들었습니다.

> 화살표 위, 아래 키로 추천 언어 목록의 커서를 이동하는 것을 처리하겠습니다.
>
> 현재 추천 언어 어디를 순회하고 있는지를 알기 위해 `selectedIndex` 라는 값을 `Suggestion` 컴포넌트에 state 값으로 추가합니다.

```js
// src > components > Suggestion.js

class Suggestion {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = {
      selectedIndex: initialState.selectedIndex,
      items: initialState.items,
    };

    this.$suggestion = document.createElement('div');
    this.$suggestion.setAttribute('class', 'Suggestion');
    this.$target.appendChild(this.$suggestion);

    this.render();
  }

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.render();
  };

  render() {
    ...
  }
}
export default Suggestion;
```

> `App` 컴포넌트에 있는 `Suggestion` 의 상태 변경시 selectedIndex 값을 넣어줍니다.

```js
// src > App.js

import SearchInput from './components/SearchInput';
import { fetchLanguages } from './api/api';
import Suggestion from './components/Suggestion';

class App {
  constructor({ $target }) {
    this.$target = $target;
    this.state = {
      fetchedLanguages: [],
      selectedLanguages: [],
    };
    this.suggestion = null;
    this.selectedLanguges = null;

    this.render();
  }

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.suggestion.setState({
      selectedIndex: 0,
      items: this.state.fetchedLanguages,
    });
  };

  render() {
    ...

    this.suggestion = new Suggestion({
      $target: this.$target,
      initialState: { selectedIndex: 0, items: [] },
    });
  }
}
export default App;
```

> 순회중인 언어목록을 강조하기 위해 `Suggestion__item--selected` 클래스를 이용해 처리하겠습니다.

```js
// src > components > Suggestion.js

class Suggestion {
  constructor({ $target, initialState }) {
    ...
  }

  ...

  render() {
    const { items, selectedIndex } = this.state;
    if (items.length > 0) {
      this.$suggestion.style.display = 'block';
      this.$suggestion.innerHTML = `
      <ul>
        ${items
          .map(
            (item, idx) => `
            <li class='${
              idx === selectedIndex ? 'Suggestion__item--selected' : ''
            }' data-index='${idx}'>${item}</li>
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
```

> 이제 검색을 하면 첫번째 추천 언어가 선택되는 것을 볼 수 있습니다.

> 화살표 키 입력으로 선택변경을 해보겠습니다.

```js
// src > components > Suggestion.js

class Suggestion {
  constructor({ $target, initialState, onSelect}) {
    ...

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
        }

        this.setState({ ...this.state, selectedIndex: nextIndex });
      }
    });
  }

  ...

}
export default Suggestion;
```

> 화살표 위, 아래 키를 사용하면 선택이 변경되는 것을 볼 수 있습니다.
>
> `onSelect` 함수의 내용은 [언어 선택](#언어-선택) 에서 확인할 수 있습니다.

> 여기까지 진행을 했다면 에러가 발생하게 되는 것을 볼 수 있습니다. 발생하는 에러는 화살표 키를 입력하면 자꾸 검색이 실행되는것 입니다. 그 이유는 `SearchInput` 컴포넌트에서 모든 키 입력에 대해 검색이 실행되게 만들었기 때문입니다. 이제 그것을 수정해 주겠습니다.

```js
// src > components > SearchInput.js

class SearchInput {
  constructor({ $target, initialState, onChange }) {
    this.$target = $target;
    this.state = initialState;
    this.onChange = onChange;

    this.render();
  }

  render() {
    ...

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
```

> 화살표 키와 엔터키를 제외한 다른 키를 입력했을때 검색이 일어나게 만들고, `form` 의 기본 기능인 엔터키를 입력했을때 페이지가 새로고침 되지 않게 하기 위해 `preventDefault` 메서드를 사용하겠습니다.

<hr/>

## 언어 선택

- 언어 선택 처리를 합니다.
  - 언어 목록이 렌더링 된 상태에서 엔터키를 누르는 경우, 현재 선택처리된 언어를 alert으로 띄우고 아래에 제시된 동작을 합니다.
  - 언어 목록이 렌더링 된 상태에서 언어를 클릭한 경우, 해당 언어를 alert으로 띄우고 아래에 제시된 동작을 합니다.
    - 단순히 선택된 검색어에 대해 alert만 띄우면 됩니다.
    - 다른 문자열 첨가 없이 언어명만 alert으로 띄워야 합니다.

```js
// src > components > Suggestion.js

class Suggestion {
  constructor({ $target, initialState, onSelect}) {
    ...

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
  }

  ...

}
export default Suggestion;
```

> 엔터키를 누르면 `onSelect` 함수가 실행되게 코드를 추가하였습니다.

```js
// src > App.js

import SearchInput from './components/SearchInput';
import { fetchLanguages } from './api/api';
import Suggestion from './components/Suggestion';

class App {
  constructor({ $target }) {
    ...
    this.state = {
      fetchedLanguages: [],
      selectedLanguages: [],
    };
  }

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.suggestion.setState({
      selectedIndex: 0,
      items: this.state.fetchedLanguages,
    });
  };

  render() {

    ...

    this.suggestion = new Suggestion({
      $target: this.$target,
      initialState: { selectedIndex: 0, items: [] },
      onSelect: (language) => {
        alert(language);
      },
    });
  }
}
export default App;
```

> onSelect 함수는 alert를 실행해 선택된 언어를 보여 주도록 만들었습니다.

```js
// src > components > Suggestion.js

class Suggestion {
  constructor({ $target, initialState, onSelect }) {
    ...

    this.$suggestion.addEventListener('click', (e) => {
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

  ...

}
export default Suggestion;
```

> 이벤트 위임을 사용해 클릭한 요소가 `li` 요소일 경우에 동작하도록 만들었습니다.
>
> 클릭을 하면 `onSelect` 함수가 실행되도록 만들었습니다.

<hr/>

## 선택된 언어 렌더링

- 선택된 검색어를 alert으로 노출한 다음, 주어진 마크업을 참고하여 `SelectedLanguage` 에 렌더링 합니다.
- 이미 선택된 언어를 다시 검색하여 선택처리하여도 중복으로 들어가서는 안 됩니다.
  - 이미 선택된 언어를 다시 넣으면 순서상 맨 뒤로 들어가야 합니다.
    - 예시: `JavaScript, TypeScript, Python` 이 선택된 상태에서 `Javascript` 를 다시 검색해서 선택하면 `Typescript, Python, Javascript` 순서가 되어야 함.
- 언어는 최대 5개까지 넣을 수 있으며, 5개를 초과하는 경우 가장 처음에 넣은 언어를 제거하고 넣습니다.(FIFO)
  - 예시: `ActionScript, JavaScript, TypeScript, Java, Python` 이 들어간 상태에서 `Kotlin` 을 검색하고 선택한다면 `JavaScript, TypeScript, Java, Python, Kotlin` 이 되어야 함.

> 선택된 검색어를 저장하기 위한 state값인 selectedLanguages를 사용하겠습니다.
>
> onSelect 함수를 실행하면 선택한 검색어를 selectedLanguages 배열에 저장하도록 하겠습니다.

```js
// src > App.js

import SearchInput from './components/SearchInput';
import { fetchLanguages } from './api/api';
import Suggestion from './components/Suggestion';

class App {
  ...

  render() {
    ...

    this.suggestion = new Suggestion({
      $target: this.$target,
      initialState: { selectedIndex: 0, items: [] },
      onSelect: (language) => {
        alert(language);

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
```

> findIndex 메서드를 사용해 선택한 언어가 이미 존재한다면 해당 요소를 지우고 맨 뒤에 추가하는 방식으로 만들었습니다.

> 이제 selectedLanguages 데이터를 사용할 `SelectedLanguage` 컴포넌트를 만들어 보겠습니다.

```js
// src > components > SelectedLanguage.js

class SelectedLanguage {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = initialState;
    this.selectedLanguageDiv = document.createElement('div');
    this.selectedLanguageDiv.setAttribute('class', 'SelectedLanguage');
    this.$target.appendChild(this.selectedLanguageDiv);

    this.render();
  }

  setState = (nextState) => {
    this.state = nextState;

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
```

> App.js 에서 `SelectedLanguage` 컴포넌트를 호출한 다음, setState 함수 내에서 `SelectedLanguage` 컴포넌트의 setState 를 호출하여 상태를 변경 하도록 합니다.

```js
// src > App.js

import SearchInput from './components/SearchInput';
import { fetchLanguages } from './api/api';
import Suggestion from './components/Suggestion';
import SelectedLanguage from './components/SelectedLanguage';

class App {
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

  setState = (nextState) => {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.suggestion.setState({
      selectedIndex: 0,
      items: this.state.fetchedLanguages,
    });
    this.selectedLanguges.setState(this.state.selectedLanguages);
  };

  render() {
    this.selectedLanguges = new SelectedLanguage({
      $target: this.$target,
      initialState: [],
    });

    const searchInput = new SearchInput({
      ...
    });

    this.suggestion = new Suggestion({
      ...
    });
  }
}
export default App;
```

> 이제 언어를 5개까지만 표시되도록 만들어 보겠습니다.

```js
// src > components > SelectedLanguage.js

const MAX_DISPLAY_COUNT = 5;

class SelectedLanguage {
  ...

  setState = (nextState) => {
    this.state = nextState;

    if (this.state.length > MAX_DISPLAY_COUNT) {
      const startPosition = this.state.length - MAX_DISPLAY_COUNT;
      this.state = this.state.slice(startPosition);
    }
    this.render();
  };

  ...
}
export default SelectedLanguage;
```

> 언어의 개수가 5개를 초과하면 앞부분을 잘라버리는 방식으로 만들었습니다.

<hr/>

## 사용성 개선

- 화면에 접속하면 input에 focus가 자동으로 가도록 합니다.
- 렌더링 된 추천 언어 목록 내에서 입력한 키워드와 일치하는 문자열에 대해서 `Suggestion__item--matched` 클래스를 사용하여 강조 처리를 합니다.
  - 주어진 샘플코드의 스타일을 참고하여 작업합니다.

> input 에 focus 가 자동으로 가게 하려면 `SearchInput` 컴포넌트가 생성될때 focus 메서드를 사용하면 됩니다.

```js
// src > components > SearchInput.js

class SearchInput {
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

    ...
  }
}
export default SearchInput;
```

> `$input.focus()` 한줄만 추가하면 됩니다.

> 키워드가 일치하는 문자열을 강조처리를 하려면 입력한 키워드를 저장해야 합니다.
>
> App 컴포넌트의 state 에 강조처리를 할 키워드를 저장하겠습니다.

```js
// src > App.js

...

class App {
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
    ...

    const searchInput = new SearchInput({
      $target: this.$target,
      initialState: '',
      onChange: async (keyword) => {
        if (keyword.trim().length === 0) {
          this.setState({ fetchedLanguages: [] });
        } else {
          const languages = await fetchLanguages(keyword);
          this.setState({ fetchedLanguages: languages, keyword });
        }
      },
    });

    ...
  }
}
export default App;
```

> `App` 컴포넌트의 초기 state 에 `keyword` 값을 추가하고, setState 함수에서 `Suggestion` 컴포넌트로 `keyword` 값을 넘겨주고 있습니다.
>
> `keyword` 값은 `SearchInput` 컴포넌트에서 `onChage` 함수를 통해 변경됩니다.
>
> `Suggestion` 컴포넌트에서 저 `keyword` 값을 사용해 보겠습니다.

```js
// src > components > Suggestion.js

class Suggestion {
  constructor({ $target, initialState, onSelect }) {
    this.$target = $target;
    this.state = {
      selectedIndex: initialState.selectedIndex,
      items: initialState.items,
      keyword: initialState.keyword,
    };

    ...

  }

  ...

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
```

> `renderMatchedItem` 함수는 키워드와 추천언어를 가져와서 키워드와 동일한 부분을 찾고 그 부분을 `span` 태그와 `Suggestion__item--matched` 클래스를 사용해 꾸며줍니다.

<hr/>

## API 사용 최적화

- 검색어를 입력하는 동안은 API 호출을 지연하고, 검색어 입력이 되었다고 판단이 되는 경우 API를 호출하도록 최적화 처리를 합니다.
- 검색어에 따른 API 응답을 캐시해서 사용합니다. 검색어 캐시의 경우, 브라우저를 닫았다 다시 켜면 초기화 되어야 합니다.

> API 호출 지연은 `debounce` 로 처리하겠습니다.

```js
// src > App.js

...

class App {
  constructor({ $target }) {
    ...
  }

  debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  ...

  render() {
    ...

    const searchInput = new SearchInput({
      $target: this.$target,
      initialState: '',
      onChange: this.debounce(async (keyword) => {
        if (keyword.trim().length === 0) {
          this.setState({ fetchedLanguages: [] });
        } else {
          const languages = await fetchLanguages(keyword);
          this.setState({ fetchedLanguages: languages, keyword });
        }
      }),
    });

    ...
  }
}
export default App;
```

> `debounce` 함수를 사용하여 `SearchInput` 컴포넌트에 사용될 `onchange` 함수를 500ms의 딜레이를 가진 함수로 만들었습니다. 연속적인 함수 호출이 있더라도 500ms가 지나야 실행이 됩니다.

> 검색어에 따른 응답을 캐시하여 저장해야 합니다. `TimeLimitedCache` 클래스를 만들어 캐시를 저장하겠습니다.

```js
// src > api > api.js

const API_END_POINT =
  'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev';

class TimeLimitedCache {
  #cache;
  constructor() {
    this.#cache = new Map();
  }

  get = (key) => this.#cache.get(key)?.value ?? -1;

  set = (key, value, duration) => {
    const isExist = this.#cache.has(key);
    if (isExist) clearTimeout(this.#cache.get(key).timeoutId);

    this.#cache.set(key, {
      value,
      timeoutId: setTimeout(() => this.#cache.delete(key), duration),
    });

    return isExist;
  };

  count = () => this.#cache.size;
}

const cache = new TimeLimitedCache();

const request = async (url) => {
  if (cache.get(url) !== -1) return cache.get(url);

  const res = await fetch(url);

  if (res.ok) {
    const json = res.json();
    cache.set(url, json, 1000 * 60);
    return json;
  }

  throw new Error('요청에 실패함');
};

export const fetchLanguages = async (keyword) =>
  request(`${API_END_POINT}/languages?keyword=${keyword}`);
```

> 외부에서 캐시값에 접근하지 못하도록 프라이빗 변수명을 사용하고, setTimeout 을 사용해 duration 시간동안 캐시가 유지되도록 하였습니다.

<hr/>
