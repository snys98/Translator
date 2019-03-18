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

  // markdown 的 加载地址
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
    // 自定义 markdown render
    const renderer = new MarkedRenderer();
    // 在 pre 内加上 language 标识，装有插件的情况下可以进行代码高亮
    renderer.code = (code: string, language: string, isEscaped: boolean) => {
      return `<pre class="language-${language}"><code class="language-${language}">${code}</code></pre>`;
    };
    // 避免 li 被异常渲染，将 li 中的内容用 p 元素包裹起来
    renderer.listitem = (text: string) => {
      return `<li><p>${text}</p></li>`;
    };
    markdownService.options = { renderer: renderer };
  }

  markdownHtml: string | SafeHtml;

  // 调用翻译 API
  // text：待翻译的文本
  // specialTranslates：特殊翻译字典，key 对应的文本将被翻译成 value
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

  // 从远端加载 markdown 并渲染、翻译
  async refresh() {
    // 加载 markdown 文本
    let markdown = await this.markdownService.getSource(this.src).toPromise();
    // 将 markdown 采用我们修改后的规则编译成 html
    let rawHtml = this.markdownService.compile(markdown);
    // 接下来是构造即将被渲染到页面上的文档Dom
    let tempDiv = document.createElement('div');
    // 在事先定义的 html 文档占位符上插入文档dom
    document.getElementById('placeHolder').appendChild(tempDiv);
    tempDiv.innerHTML = rawHtml;
    // 需要获取文本内容的 html 标签
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
    // 获取需要被翻译的 dom 块
    let translateBlocks = validTags.map(x => Array.from(tempDiv.querySelectorAll(x))).reduce((a, b) => a.concat(b)) as Array<HTMLElement>;
    for (const item of translateBlocks) {
      // 翻译 dom 块的 innerText
      let text = await this.translate(` ${item.innerText} `,
        // 豁免所有 code 标签对应的内容
        Array.from(item.querySelectorAll('code')).map(x => {
        return { key: x.innerText, value: x.innerText };
        }));
      // 将翻译结果写入对应 dom，翻译结果将在对应 dom 的 before 伪元素中被显示
      item.setAttribute('translation', text);
      // 标记了这个 class 的内容会参与 hover 翻译
      item.classList.add('raw');
    }

    // 渲染html
    this.markdownHtml = this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }
}
