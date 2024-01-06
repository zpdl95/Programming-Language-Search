const API_END_POINT =
  'https://wr4a6p937i.execute-api.ap-northeast-2.amazonaws.com/dev';

class TimeLimitedCache {
  /** @type {Map<string, {value : string[], timeoutId : number}>} */
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

/**
 *
 * @param {string} keyword
 * @returns {Promise<string[]>}
 */
export const fetchLanguages = async (keyword) =>
  request(`${API_END_POINT}/languages?keyword=${keyword}`);
