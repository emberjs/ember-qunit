// FIXME: Upstream
declare module 'ember-cli-test-loader/test-support/index' {
  export default class TestLoader {
    static load(): void;
    shouldLoadModule(moduleName: string): boolean;
    listModules(): string[];
    listTestModules(): string[];
    loadModules(): void;
    require(moduleName: string): void;
    unsee(moduleName: string): void;
    moduleLoadFailure(moduleName: string, error: { stack: unknown }): void;
  }

  type Matcher = (moduleName: string) => boolean;

  export function addModuleExcludeMatcher(matcher: Matcher): void;
  export function addModuleIncludeMatcher(matcher: Matcher): void;
}
