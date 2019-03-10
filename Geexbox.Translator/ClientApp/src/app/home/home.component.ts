import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  before = `<ul><li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li><li><strong>Angular CLI integration</strong>. In development mode, there's no need to run <code>ng serve</code>. It runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file.</li><li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and your <code>dotnet publish</code> configuration automatically invokes <code>ng build</code> to produce minified, ahead-of-time compiled JavaScript files.</li></ul>`;
  after = '';

  dictionary: { key: string, value: string }[] = [
    { key: 'angular', value: 'angular' },
    { key: 'Counter', value: 'Counter' },
    { key: 'minified', value: '压缩后的' },
    { key: 'ahead-of-time compiled', value: '预编译' }];
  /**
   *
   */
  constructor(private http: HttpClient) {

  }
  addDict() {
    this.dictionary.push({
      key: 'test',
      value: '测试',
    });
  }
  translate() {
    this.http.post('/api/translate/translate', {
      text: this.before,
      dictionary: this.dictionary
    }, {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json'
          })
      }).toPromise().then(res => {
        this.after = res[0].Translations[0].Text;
      });
  }
}
