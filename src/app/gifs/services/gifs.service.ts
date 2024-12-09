import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY = 'iKLjBisjLZNHvKOwtImRHJ4EAKqPXfCG';
const serviceUrl = 'https://api.giphy.com/v1/gifs/search';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.trim().toLocaleLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    const history = localStorage.getItem('history');
    if (!history) return;

    const historyArray = JSON.parse(history);
    this._tagsHistory = historyArray;
    if (historyArray.length === 0) return;
    this.searchTag(historyArray[0]);
  }
  

  searchTag(tag: string) {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    // fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${tag}&limit=10`)
    // .then(response => response.json())
    // .then(({data}) => {
    //   console.log(data);
    // })
    // .catch(console.log);

    const params = new HttpParams()
      .set('api_key', GIPHY_API_KEY)
      .set('q', tag)
      .set('limit', '10');
    this.http
      .get<SearchResponse>(`${serviceUrl}`, { params })
      .subscribe((resp) => {
        console.log(resp.data);
        this.gifsList = resp.data;
      });
  }
}
