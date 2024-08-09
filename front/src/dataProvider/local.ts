type FavItem = {
  id: string;
  sensor: any;
  field: string;
  start: Date;
  end: Date;
};
class LocalProvider {
  favs: FavItem[] | null = null;
  key = "fav";
  generateId(fav: Omit<FavItem, "id">) {
    return `${fav.sensor.id}-${fav.field}`;
  }
  getFavs(): FavItem[] {
    if (this.favs !== null) return this.favs;
    this.favs = JSON.parse(localStorage.getItem(this.key) || "[]") ?? [];
    return this.favs ?? [];
  }
  addFav(fav: Omit<FavItem, "id">) {
    this.delFav(fav);
    const favs = this.getFavs() ?? [];
    const nf = { ...fav, id: this.generateId(fav) };
    favs.push(nf);
    this.favs = favs;
    localStorage.setItem(this.key, JSON.stringify(this.favs ?? []));
  }
  delFav(fav: Omit<FavItem, "id">) {
    const favs = this.getFavs() ?? [];
    const id = this.generateId(fav);
    this.favs = favs.filter((f) => f.id != id);
    localStorage.setItem(this.key, JSON.stringify(this.favs ?? []));
  }
  isFav(fav: Omit<FavItem, "id">) {
    const favs = this.getFavs() ?? [];
    const id = this.generateId(fav);
    return favs.findIndex((f) => f.id == id) !== -1;
  }
}

const localProvider = new LocalProvider();
export default localProvider;
