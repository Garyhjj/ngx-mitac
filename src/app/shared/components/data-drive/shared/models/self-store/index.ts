export class SelfStore {
  user: string;
  set: { id: string | number; prefer: any }[];
  constructor(user: string, set: { id: string | number; prefer: any }[]) {
    this.user = user;
    this.set = set;
  }
  combine(other: SelfStore) {
    if (other && other.user === this.user) {
      other.set = other.set || [];
      this.set.forEach(s => {
        const idx = other.set.findIndex(o => o.id === s.id);
        if (idx > -1) {
          other.set.splice(idx, 1, s);
        } else {
          other.set.push(s);
        }
        other.set = other.set.map(o => {
          if (o.id === s.id) {
            o.prefer = s.prefer;
          }
          return o;
        });
      });
      return other;
    } else {
      return other;
    }
  }
}
export class SelfStoreSet {
  store: SelfStore[];
  private _maxUser: number;
  constructor() {
    this.store = this.getStore();
    this._maxUser = 3;
  }

  get selfStoreName() {
    return 'selfStoreSet';
  }
  get maxUser() {
    return this._maxUser;
  }
  set maxUser(val: number) {
    this._maxUser = val;
  }

  getStore() {
    const storeStr = localStorage.getItem(this.selfStoreName);
    let store;
    if (storeStr) {
      store = JSON.parse(storeStr);
      return store instanceof Array ? store : [];
    }
    return [];
  }
  getSetByUserAndId(user: string, id: string | number) {
    const all = this.getStore().find(s => s && s.user === user);
    if (all && all.set.length > 0) {
      const set = all.set.find(s => s.id === id);
      return set ? set.prefer : [];
    }
    return [];
  }
  update(set: SelfStore) {
    let store = this.getStore();
    const targetIdx = store.findIndex(s => s && s.user === set.user);
    if (targetIdx < 0) {
      while (store.length > 2) {
        store.shift();
      }
      store.push(set);
    } else {
      store = store.map((s: SelfStore, i) => {
        return set.combine(s);
      });
    }
    this.store = store;
    localStorage.setItem(this.selfStoreName, JSON.stringify(store));
  }
}
