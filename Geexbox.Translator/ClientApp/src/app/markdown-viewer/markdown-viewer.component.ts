import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ElementRef, Input } from '@angular/core';
import { MarkdownService, MarkedRenderer } from 'ngx-markdown';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.scss']
})
export class MarkdownViewerComponent {

  private _src = 'https://raw.githubusercontent.com/kulshekhar/ts-jest/master/README.md';
  public get src(): string {
    return this._src;
  }
  public set src(v: string) {
    this._src = v;
    this.refresh();
  }

  constructor(private http: HttpClient,
    private markdownService: MarkdownService,
    private sanitizer: DomSanitizer) {
    const renderer = new MarkedRenderer();
    renderer.code = (code: string, language: string, isEscaped: boolean) => {
      return `<pre class="language-${language}"><code class="language-${language}">${code}</code></pre>`;
    };
    renderer.listitem = (text: string) => {
      return `<li><p>${text}</p></li>`;
    };
    markdownService.options = { renderer: renderer };
  }

  markdownHtml: string | SafeHtml;
  translate = async (text: string, specialTranslates: { key: string, value: string }[]) => {
    const result = await this.http.post('/api/translate/translate', {
      text: text,
      dictionary: specialTranslates
    }, {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json'
          })
      }).toPromise().then(res => {
        return res[0].Translations[0].Text as string;
      });
    return result;
  }
  async ngOnInit(): Promise<void> {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    await this.refresh();
  }
  async refresh() {
    let markdown = await this.markdownService.getSource(this.src).toPromise();
    let rawHtml = this.markdownService.compile(markdown);
    this.markdownHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
    let tempDiv = document.createElement('div');
    document.getElementById('placeHolder').appendChild(tempDiv);
    tempDiv.innerHTML = rawHtml;
    let validTags = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'h7',
      'h8',
      'h9',
      'td',
      'th',
      'p'];
    let translateBlocks = validTags.map(x => Array.from(tempDiv.querySelectorAll(x))).reduce((a, b) => a.concat(b)) as Array<HTMLElement>;
    /*     let translateBlocks = [
          , ...Array.from(tempDiv.getElementsByTagName('h1'))
          , ...Array.from(tempDiv.getElementsByTagName('h2'))
          , ...Array.from(tempDiv.getElementsByTagName('h3'))
          , ...Array.from(tempDiv.getElementsByTagName('h4'))
          , ...Array.from(tempDiv.getElementsByTagName('h5'))
          , ...Array.from(tempDiv.getElementsByTagName('h6'))
          , ...Array.from(tempDiv.getElementsByTagName('h7'))
          , ...Array.from(tempDiv.getElementsByTagName('h8'))
          , ...Array.from(tempDiv.getElementsByTagName('h9'))
          , ...Array.from(tempDiv.getElementsByTagName('p'))
        ] as Array<HTMLElement>; */
    for (const item of translateBlocks) {
      let text = await this.translate(` ${item.innerText} `, Array.from(item.querySelectorAll('code')).map(x => {
        return { key: x.innerText, value: x.innerText };
      }));
      item.setAttribute('translation', text);
      item.classList.add('raw');
    }
    this.markdownHtml = this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }
}
