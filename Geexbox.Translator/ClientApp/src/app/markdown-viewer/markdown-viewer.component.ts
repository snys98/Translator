import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './markdown-viewer.component.html',
  styleUrls: ['./markdown-viewer.component.sass']
})
export class MarkdownViewerComponent implements OnInit {

  markdown: string = `
  # test
  1. hehe
  2. haha
  `;
  constructor() { }

  ngOnInit() {
  }

}
