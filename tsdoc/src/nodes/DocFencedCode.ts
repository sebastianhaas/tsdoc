import { DocNodeKind, IDocNodeParameters, DocNode } from './DocNode';
import { Excerpt } from '../parser/Excerpt';
import { DocParticle } from './DocParticle';

/**
 * Constructor parameters for {@link DocFencedCode}.
 */
export interface IDocFencedCodeParameters extends IDocNodeParameters {
  openingDelimiterExcerpt?: Excerpt;

  languageExcerpt?: Excerpt;
  language?: string | 'ts' | '';

  codeExcerpt?: Excerpt;
  code: string;

  closingDelimiterExcerpt?: Excerpt;
}

/**
 * Represents CommonMark-style code fence, i.e. a block of program code that
 * starts and ends with a line comprised of three backticks.  The opening delimiter
 * can also specify a language for a syntax highlighter.
 */
export class DocFencedCode extends DocNode {
  /** {@inheritDoc} */
  public readonly kind: DocNodeKind = DocNodeKind.FencedCode;

  // The opening ``` delimiter and padding
  private _openingDelimiterParticle: DocParticle | undefined; // never undefined after updateParameters()

  // The optional language string, and newline
  private _languageParticle: DocParticle | undefined;         // never undefined after updateParameters()

  // The code content
  private _codeParticle: DocParticle | undefined;             // never undefined after updateParameters()

  // The closing ``` delimiter, spacing, and newline
  private _closingDelimiterParticle: DocParticle | undefined; // never undefined after updateParameters()

  /**
   * Don't call this directly.  Instead use {@link TSDocParser}
   * @internal
   */
  public constructor(parameters: IDocFencedCodeParameters) {
    super(parameters);
  }

  /**
   * A name that can optionally be included after the opening code fence delimiter,
   * on the same line as the three backticks.  This name indicates the programming language
   * for the code, which a syntax highlighter may use to style the code block.
   *
   * @remarks
   * The TSDoc standard requires that the language "ts" should be interpreted to mean TypeScript.
   * Other languages names may be supported, but this is implementation dependent.
   *
   * CommonMark refers to this field as the "info string".
   *
   * @privateRemarks
   * Examples of language strings supported by GitHub flavored markdown:
   * https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml
   */
  public get language(): string | 'ts' | '' {
    return this._languageParticle!.content;
  }

  /**
   * The text that should be rendered as code.
   */
  public get code(): string {
    return this._codeParticle!.content;
  }

  /** @override */
  public updateParameters(parameters: IDocFencedCodeParameters): void {
    super.updateParameters(parameters);

    this._openingDelimiterParticle = new DocParticle({
      particleId: 'openingDelimiter',
      excerpt: parameters.openingDelimiterExcerpt,
      content: '```'
    });

    this._languageParticle = new DocParticle({
      particleId: 'language',
      excerpt: parameters.languageExcerpt,
      content: parameters.language || ''
    });

    this._codeParticle = new DocParticle({
      particleId: 'code',
      excerpt: parameters.codeExcerpt,
      content: parameters.code
    });

    this._closingDelimiterParticle = new DocParticle({
      particleId: 'closingDelimiter',
      excerpt: parameters.closingDelimiterExcerpt,
      content: '```'
    });
  }

  /**
   * {@inheritDoc}
   * @override
   */
  public getChildNodes(): ReadonlyArray<DocNode> {
    return [
      this._openingDelimiterParticle!,
      this._languageParticle!,
      this._codeParticle!,
      this._closingDelimiterParticle!
    ];
  }
}
