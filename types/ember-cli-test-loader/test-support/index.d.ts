declare module 'ember-cli-test-loader/test-support/index' {
  export default class TestLoader {
    /** Instantiates a new TestLoader and loads the modules. */
    static load(): void;

    /**
     * Can be overridden in order to customize the criteria for identifying test
     * modules.
     */
    shouldLoadModule(moduleName: string): boolean;

    moduleLoadFailure(moduleName: string, error: unknown): void;

    /** Use `TestLoader.load()` static method instead. */
    protected constructor();

    // Assumed private:
    // loadModules(): void;
    // listModules(): string[];
    // listTestModules(): string[];
    // require(moduleName: string): void;
    // unsee(moduleName: string): void;
  }

  export function addModuleExcludeMatcher(
    matcher: (moduleName: string) => boolean
  ): void;

  export function addModuleIncludeMatcher(
    matcher: (moduleName: string) => boolean
  ): void;
}
