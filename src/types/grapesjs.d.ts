declare module 'grapesjs' {
  const grapesjs: any;
  export default grapesjs;
  export interface Editor {
    getHtml(): string;
    getCss(): string;
    setComponents(html: string): void;
    setStyle(css: string): void;
    runCommand(command: string): void;
    stopCommand(command: string): void;
    getConfig(): any;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    Commands: any;
    Pages: any;
    Canvas: any;
  }
}

declare module 'grapesjs-preset-webpage' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-blocks-basic' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-plugin-forms' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-navbar' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-component-countdown' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-plugin-export' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-tabs' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-custom-code' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-tooltip' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-typed' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs-style-bg' {
  const plugin: any;
  export default plugin;
}

declare module 'grapesjs/dist/css/grapes.min.css';
