import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.sass']
})
export class MarkdownViewerComponent implements OnInit, AfterViewInit {
  async translate(text: string): Promise<any> {
    const result = await this.http.post('/api/translate/translate', {
      text: text,
      dictionary: []
    }, {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json'
          })
      }).toPromise().then(res => {
        return res[0].Translations[0].Text;
      });
    return result;
  }
  constructor(private http: HttpClient) {
    setTimeout(() => {
      const translates = document.getElementsByClassName('translate');
      for (let i = 0; i < translates.length; i++) {
        const item = translates[i];
        item.addEventListener('click', (event: Event): any => {
          let element = (event.target as Element);
          let text = element.textContent;
          while (element && element.previousElementSibling && element.className.indexOf('translate') !== -1) {
            text = element.previousElementSibling.textContent + text;
            element = element.previousElementSibling;
          }
          while (element && element.nextElementSibling && element.className.indexOf('translate') !== -1) {
            text = text + element.nextElementSibling.textContent;
            element = element.nextElementSibling;
          }
          this.translate(text).then(res => console.log(res));
        });
      }
    }, 1000);
  }
  ngAfterViewChecked(): void {
    // Called after every check of the component's view. Applies to components only.
    // Add 'implements AfterViewChecked' to the class.

  }
  ngAfterContentInit(): void {
    // Called after ngOnInit when the component's or directive's content has been initialized.
    // Add 'implements AfterContentInit' to the class.

  }
  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.

  }
  /*   translate(dom: HTMLParagraphElement): any {
      console.log(dom.innerHTML);
    } */
  ngOnInit() {

  }

}
