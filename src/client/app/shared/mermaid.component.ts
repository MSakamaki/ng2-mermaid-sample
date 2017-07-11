import {
  Component,
  Directive,
  ElementRef,
  Input,
  Sanitizer,
  SecurityContext,
  AfterContentInit
} from '@angular/core';

@Component({
  selector: 'ng2-mermaid',
  template: '<div id="ng2-mermaid-component" [innerHTML]="mermaidText"></div>'
})
export class MermaidComponent {

  // import ./node_modules/mermaid/dist/mermaid.css
  // umd file generate command
  // browserify node_modules/mermaid/src/mermaid.js -o dist/mermaid.umd.js -s mermaid
  mermaid: IMeramid = require('./mermaid.umd.js');

  private _text :string;
  @Input() set text( merkd: string) {
    Promise.resolve().then(() => {
        this._text=merkd;
    });
  }

  get mermaidText() {
    return this.svgText;
  }

  constructor(private _sanitizer: Sanitizer, private el: ElementRef) {}

  public get svgText(): string {
    let svg  = this.mermaid.mermaidAPI.render('ng2-mermaid-component', this._text, null, this.el.nativeElement);
    return this._sanitizer.sanitize(SecurityContext.HTML, svg);
  }
}

@Directive({
  selector: '[ng2-mermaid]',
})
export class MermaidDirective implements AfterContentInit {

  mermaid: IMeramid = require('./mermaid.umd.js');

  constructor(private el: ElementRef) { }

  ngAfterContentInit() {
    this.el.nativeElement.innerHTML = this.mermaid.mermaidAPI.render('ng2-mermaid-directive', this.el.nativeElement.innerText);
  }
}

interface IMeramid {
  mermaidAPI: {
    render: (id: string, text: string, event?: any, element?: any) => string;
  }
}
